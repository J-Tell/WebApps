SELECT
    id, item, due_date
FROM
    stuff
JOIN subjects
    ON stuff.subjectID = subjects.subjectID
WHERE
    user_id = ?