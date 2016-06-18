<?php

header('Content-Type: application/javascript');

ob_start('ob_gzhandler');

$s = [
  'event-util',
  'class-util',
  'util',
  'observable',
  'scope',
  'bind',
  'exports',
];

echo "(function () {\n";

foreach ($s as $n) {
  echo str_replace("\r\n", "\n", file_get_contents($n . '.js'));
}

echo "}())\n";
