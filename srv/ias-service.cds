service FindDuplicateIAS {

    entity dupUsers {
        id       : String;
        userName : String;
        active   : Boolean;
    }

    function duplicatedUsers() returns array of dupUsers;
}
