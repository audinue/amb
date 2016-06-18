<?php

$chapter = intval($_GET['chapter']);

$pages = glob('./' . str_pad($chapter, 3, '0', STR_PAD_LEFT) . '/*.jpg');

echo json_encode($pages, JSON_UNESCAPED_SLASHES);
