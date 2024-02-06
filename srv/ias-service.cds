service HandleDuplicateUsersIAS {

    entity updatedUsers {
        id          : String;
        userName    : String;
        email       : String;
        customAttr1 : String;
        customAttr2 : String;
        customAttr3 : String;
        customAttr4 : String;
    }

    function handleDuplicatedUsers() returns array of updatedUsers;
}
