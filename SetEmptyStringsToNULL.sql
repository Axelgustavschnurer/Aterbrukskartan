UPDATE map_item
SET [name] = NULLIF([name], ''),
    [organisation] = NULLIF([organisation], ''),
    [address] = NULLIF([address], ''),
    [city] = NULLIF([city], '')

UPDATE recycle
SET [contact] = NULLIF([contact], ''),
    [description] = NULLIF([description], ''),
    [external_links] = NULLIF([external_links], ''),
    [available_materials] = NULLIF([available_materials], ''),
    [looking_for_materials] = NULLIF([looking_for_materials], '')
    [attachment_name] = NULLIF([attachment_name], '')