# Objective

Update IAS user with new custom attributes values, like below:

Custom Attribute | Value
-------------------- | ------------------
`customAttribute1` | R
`customAttribute2` | DEMO
`customAttribute3` | RDEMO (1,2,3...)
`customAttribute4` | 0 (1,2,3..)


# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


# Flow Logic

	1. Get users list from IAS
	2. Filter only userName is filled
	3. Filter only customAttrs is filled (user["urn:sap:cloud:scim:schemas:extension:custom:2.0:User"])
	4. Order by created at (backend handle)
	5. Build user id with customAttrs like tomorrow doesn't exists (attr3 = attr1 + attr2)
	6. Make a list with all attr3 created previously
	7. Iterate this list then iterate main list where attr3 = attr3 
	8. Increment attr3 then fill attr4 too
	9. Prepare post payload
	10. Finish :)


## Next Steps

- Open a new terminal and run `cds watch` 
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.
