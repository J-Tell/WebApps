SELECT
    id, item, due_date, subjects.subjectName as subject, stuff.subjectID as subjectID, description
FROM
    stuff
JOIN subjects
    ON stuff.subjectID = subjects.subjectID
WHERE
    id = ?
AND
    user_id = ?
ORDER BY
    due_date