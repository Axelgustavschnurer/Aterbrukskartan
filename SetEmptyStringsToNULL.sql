UPDATE map_item
SET [name] = NULLIF([name], ''),
    [organisation] = NULLIF([organisation], ''),
    [address] = NULLIF([address], ''),
    [city] = NULLIF([city], '')

UPDATE story
SET [category_swedish] = NULLIF([category_swedish], ''),
    [category_english] = NULLIF([category_english], ''),
    [educational_program] = NULLIF([educational_program], ''),
    [description_swedish] = NULLIF([description_swedish], ''),
    [description_swedish_short] = NULLIF([description_swedish_short], ''),
    [description_english] = NULLIF([description_english], ''),
    [description_english_short] = NULLIF([description_english_short], ''),
    [open_data] = NULLIF([open_data], ''),
    [reports] = NULLIF([reports], ''),
    [report_title] = NULLIF([report_title], ''),
    [videos] = NULLIF([videos], ''),
    [pdf_case] = NULLIF([pdf_case], '')

UPDATE recycle
SET [contact] = NULLIF([contact], ''),
    [description] = NULLIF([description], ''),
    [external_links] = NULLIF([external_links], ''),
    [available_materials] = NULLIF([available_materials], ''),
    [looking_for_materials] = NULLIF([looking_for_materials], '')