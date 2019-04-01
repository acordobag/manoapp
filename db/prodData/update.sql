/*update v2.memberships set parentId = (ownerId+1)  where id > 4;*/

UPDATE memberships 
SET memberships.parentId = (
    SELECT (old_users.parentId+2) 
    FROM old_users
    WHERE old_users.id = memberships.ownerId
)
where memberships.id >4;