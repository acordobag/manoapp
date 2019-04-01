
INSERT 
INTO v2.memberships 
(status, createdAt, updatedAt, parentId, ownerId, membershipTypeId)
select 
status,createdAt, updatedAt, 1, id, 1
from v2.old_users;
update v2.memberships set id = (ownerId+2)  where id > 4;