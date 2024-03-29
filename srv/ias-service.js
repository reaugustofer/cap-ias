const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");

module.exports = (srv) => {

    // -----> handleDuplicatedUsers()
    srv.on('handleDuplicatedUsers', async req => {

        // -----> get ias user to be processed
        let usersIAS = await executeHttpRequest(
            {
                destinationName: "NumenIAS",
            },
            {
                method: "get",
                url: "/Users",
                headers: {
                    "Content-Type": "application/scim+json; charset=utf-8"
                }
            }
        ).then(response => {
            return response.data.Resources;
        }).catch(error => {
            console.log('error on api call (get)');
            console.log(error);
        });

        // -----> update each ias user with new customAttribute values
        if (usersIAS != undefined) {

            let aUpdatedUsers = [];
            let aUsersToUpdate = handleDuplicatedUsers(usersIAS);

            // -----> sync call for each element, then fill return array
            aUsersToUpdate.forEach(userUpd => {
                try {
                    let updUserIAS = executeHttpRequest(
                        {
                            destinationName: "NumenIAS",
                        },
                        {
                            method: "patch",
                            url: "/Users/" + userUpd.id,
                            headers: {
                                "Content-Type": "application/scim+json; charset=utf-8"
                            },
                            data: {
                                "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
                                "Operations": [
                                    {
                                        "op": "add",
                                        "path": "urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes",
                                        "value": [
                                            {
                                                "name": "customAttribute3",
                                                "value": userUpd.customAttr3
                                            },
                                            {
                                                "name": "customAttribute4",
                                                "value": userUpd.customAttr4
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    )
                    aUpdatedUsers.push(userUpd);
                    console.log('user updated data:', userUpd);
                } catch (error) {
                    console.log('error on api call (patch), id:', userUpd.id);
                    console.log(error);
                }
            })

            return aUpdatedUsers;
        }

    }) // ----> handleDuplicated

    function handleDuplicatedUsers(UsersIAS) {
        let aUsersToBeChk = getUsersToCheck(UsersIAS);
        let aUsersCustomId = buildUsersCustomId(aUsersToBeChk);
        let aUsersToBeUpd = buildUsersToBeUpd(aUsersCustomId);
        return aUsersToBeUpd;
    }

    function getUsersToCheck(UsersIAS) {
        let aUsers = [];
        let aCustomAttr = [];
        let sEmail;

        UsersIAS.forEach(user => {
            aCustomAttr = user["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"];
            sEmail = user["emails"];
            if (user.userName && aCustomAttr != undefined) {
                let oCustAttr1 = aCustomAttr.attributes.find(attr => attr.name == "customAttribute1");
                let oCustAttr2 = aCustomAttr.attributes.find(attr => attr.name == "customAttribute2");
                let oCustAttr3 = aCustomAttr.attributes.find(attr => attr.name == "customAttribute3");
                let oCustAttr4 = aCustomAttr.attributes.find(attr => attr.name == "customAttribute4");
                aUsers.push({
                    id: user.id,
                    userName: user.userName,
                    email: sEmail.length > 0 ? sEmail[0].value : undefined,
                    customAttr1: oCustAttr1 != undefined ? oCustAttr1["value"] : null,
                    customAttr2: oCustAttr2 != undefined ? oCustAttr2["value"] : null,
                    customAttr3: oCustAttr3 != undefined ? oCustAttr3["value"] : null,
                    customAttr4: oCustAttr4 != undefined ? oCustAttr4["value"] : null
                });
            }
        });
        return aUsers;
    }

    function buildUsersCustomId(UsersIAS) {
        let aUsers = UsersIAS;
        aUsers.forEach(user => {
            user.customAttr3 = user.customAttr1 + user.customAttr2;
            user.customAttr4 = null;
        });
        return aUsers;
    }

    function buildUsersToBeUpd(UsersToBeUpd) {
        let aMainListIds = removeDuplicateIds(UsersToBeUpd);
        let aUsersToBeUpd = UsersToBeUpd;
        aMainListIds.forEach(id => {
            let iCont = 0;
            aUsersToBeUpd.forEach(user => {
                if (user.customAttr3 == id) {
                    user.customAttr3 += iCont == 0 ? "" : iCont;
                    user.customAttr4 = iCont.toString();
                    iCont++;
                }
            })
        })
        return aUsersToBeUpd;
    }

    function removeDuplicateIds(IdList) {
        let aFilteredList = IdList.map(list => list.customAttr3);
        return aFilteredList.filter((list, index) => aFilteredList.indexOf(list) === index);
    }

} // ----> module exports