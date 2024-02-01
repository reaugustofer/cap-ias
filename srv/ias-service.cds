service FindDuplicateIAS {

    entity dupUsers {
        id       : String;
        userName : String;
    }

    function duplicatedUsers() returns array of dupUsers;
}
