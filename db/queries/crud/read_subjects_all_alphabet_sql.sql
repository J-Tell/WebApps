SELECT
    subjectName, subjectID
FROM
    stuff
WHERE
    user_id = ? OR user_id IS null
ORDER BY
    subjectName ASC