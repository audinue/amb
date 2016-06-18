<?php

$u = 'http://gameofscanlation.moe/projects/little-girl/';

//file_put_contents('test.txt', file_get_contents($u));

function get_pages () {
  $contents = file_get_contents('http://gameofscanlation.moe/projects/little-girl/');
  preg_match('@<div class="PageNav"[\s\S]+?<nav>([\s\S]+?)</nav>@', $contents, $match1);
  preg_match_all('@href="([\s\S]*?)"@', $match1[1], $match2);
  return array_unique(array_map(function ($url) {
    return 'http://gameofscanlation.moe/' . $url;
  }, $match2[1]));
}

function get_chapters ($page_url) {
  $contents = file_get_contents($page_url);
  preg_match_all('@<a style="float: left;" href="([\s\S]*?)"@', $contents, $match1);
  return array_unique(array_map(function ($url) {
    return 'http://gameofscanlation.moe/' . $url;
  }, $match1[1]));
}

function get_manga_pages ($chapter_url) {
  $contents = file_get_contents($chapter_url);
  preg_match_all('@<img class="avatar NoOverlay" src="([\s\S]*?)"@', $contents, $match1);
  return $match1[1];
}

function _log($message) {
  echo "$message\n";
}

$last_chapter = 1;

foreach (array_reverse(get_pages()) as $page_url) {  
  foreach (array_reverse(get_chapters($page_url)) as $chapter_url) {
    $chapter = str_pad($last_chapter++, 3, '0', STR_PAD_LEFT);
    $last_page = 1;
    mkdir($chapter);
    foreach (get_manga_pages($chapter_url) as $manga_page_url) {
      $page = str_pad($last_page++, 3, '0', STR_PAD_LEFT);
      file_put_contents("{$chapter}/{$page}.jpg", file_get_contents($manga_page_url));
      _log("Downloaded {$chapter}/{$page}.jpg");
    }
  }
}
