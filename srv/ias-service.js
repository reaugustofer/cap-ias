const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");

module.exports = (srv) => {

    srv.on('handleDuplicatedUsers', async req => {

        try {
            let usersIAS = await executeHttpRequest(
                {
                    //destinationName: "NumenIAS",
                    url: "https://a2ktkozpw.accounts.ondemand.com/scim/Users",
                    username: 'renato.bonini@numenit.com',
                    password: 'GandalfWill01@',
                },
                {
                    method: "get",
                    //url: "/Users",
                    headers: {
                        "Content-Type": "application/scim+json; charset=utf-8"
                    }
                }
            );

            let oResources = usersIAS.data.Resources;
            let aUsersToBeChk = getUsersToCheck(oResources);
            let aUsersCustomId = buildUsersCustomId(aUsersToBeChk);
            let aUsersToBeUpd = buildUsersToBeUpd(aUsersCustomId, aUsersToBeChk);
            return aUsersToBeUpd;



















            /* let lt_proc_users = [];
            let lt_proc_users_upd = [];
            let lt_user_id = [];

            data.Resources.forEach(element => {

                var attributs = element.urnSapCloudScimSchemasExtensionCustom20User.attributes;
                var lv_atr1 = '', lv_atr2 = '', lv_atr3 = '', lv_atr4 = '';
                attributs.forEach(attr => {
                    switch (attr._name) {
                        case 'customAttribute1':
                            lv_atr1 = attr.value;
                            break;
                        case 'customAttribute2':
                            lv_atr2 = attr.value;
                            break;
                        case 'customAttribute3':
                            lv_atr3 = attr.value;
                            break;
                        case 'customAttribute4':
                            lv_atr4 = attr.value;
                            break;
                    }
                });

                lt_proc_users.push({
                    id: element.id,
                    email: element.emails[0].value,
                    atr1: lv_atr1,
                    atr2: lv_atr2,
                    atr3: lv_atr3,
                    atr4: lv_atr4,
                });

                var lv_user_id = lv_atr1 + lv_atr2;
                var lv_count = 0;

                var lo_user_id = lt_user_id.find(o => o.login === lv_user_id);
                if (lo_user_id) {

                    lo_user_id.count += 1;
                    lo_user_id.lt_user.push({
                        id: element.id,
                        email: element.emails[0].value,
                        created: element.meta.created,
                        atr1: lv_atr1,
                        atr2: lv_atr2,
                        atr3: lv_atr3,
                        atr4: lv_atr4,
                    });
                    lo_user_id.lt_created.push(element.meta.created);

                } else {
                    lo_user_id = {
                        login: lv_user_id,
                        count: 0,
                        lt_user: [],
                        lt_created: [],
                    };
                    lo_user_id.lt_user.push({
                        id: element.id,
                        email: element.emails[0].value,
                        created: element.meta.created,
                        atr1: lv_atr1,
                        atr2: lv_atr2,
                        atr3: lv_atr3,
                        atr4: lv_atr4,
                    });
                    lo_user_id.lt_created.push(element.meta.created);
                    lt_user_id.push(lo_user_id);
                }

            });

            let ls_user_id;

            lt_user_id.forEach(ls_user_id => {

                ls_user_id.lt_created.sort();
                let lt_dup = ls_user_id.lt_user;
                var lv_nuser = -1;

                for (let i = 0; i < ls_user_id.lt_created.length; i++) {
                    for (let j = 0; j < lt_dup.length; j++) {

                        var ls_dup = lt_dup[j];

                        if (ls_user_id.lt_created[i] === ls_dup.created) {

                            lv_nuser += 1;
                            if (ls_dup.atr3 === '') {
                                ls_dup.atr3 = ls_user_id.login;
                            }

                            if (ls_dup.atr4 === '') {
                                var lv_nc = lv_nuser.toString();
                                ls_dup.atr4 = lv_nc;
                                if (lv_nuser > 0) {
                                    if ((ls_user_id.login.length + lv_nc.length) <= 12) {
                                        ls_dup.atr3 = ls_user_id.login + lv_nc;
                                    } else {
                                        ls_dup.atr3 = ls_user_id.login.slice(0, ls_user_id.login.length - lv_nc.length) + lv_nc;
                                    }
                                }
                                lt_proc_users_upd.push(ls_dup);
                            }
                        }
                    }
                }
            });

            lt_proc_users_upd.forEach(async ls_user_id => {
                try {
                    let response2 = await executeHttpRequest(
                        {
                            //destinationName: "NumenIAS",
                            url: "https://a2ktkozpw.accounts.ondemand.com/scim",
                            username: 'renato.bonini@numenit.com',
                            password: 'GandalfWill01@',
                        },
                        {
                            method: "patch",
                            url: "/Users/" + ls_user_id.id,
                            headers: {
                                "Content-Type": "application/scim+json; charset=utf-8"
                            },
                            // BODY
                            data: {
                                "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
                                "Operations": [
                                    {
                                        "op": "add",
                                        "path": "urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes",
                                        "value": [
                                            {
                                                "name": "customAttribute4",
                                                "value": ls_user_id.atr4
                                            },
                                            {
                                                "name": "customAttribute3",
                                                "value": ls_user_id.atr3
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    );
                } catch (error) {
                    console.log(error);
                }
            }); */

        } catch (error) {
            console.log('error on api call (get)');
            console.log(error);
        }
    }
    )

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

    function buildUsersToBeUpd(UsersToBeUpd, CurrentUsers) {
        let aMainListIds = removeDuplicateIds(UsersToBeUpd);
        return aMainListIds;
    }

    function removeDuplicateIds(IdList) {
        // make a especific list with customattr3 field, then using this in filter operator
        return IdList.filter((list, index) => IdList.indexOf(list.customAttr3) === index);
    }

}