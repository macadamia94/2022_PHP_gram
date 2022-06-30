<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= isset($this->title) ? $this->title : _SERVICE_NM ?></title>
  <link rel="icon" type="image/png" sizes="16x16"  href="/static/img/favicons/favicon-16x16.png">
  <meta name="msapplication-TileColor" content="#ffffff">
  <meta name="theme-color" content="#ffffff">
  <link rel="stylesheet" href="/static/css/common.css">
  <?php
  if (isset($this->css)) {
    foreach ($this->css as $item) {
      $href = strpos($item, "http") === 0 ? $item : "/static/css/{$item}.css";
      echo "<link rel='stylesheet' href='{$href}'>";
    } // http로 시작하면 그대로 href에 그대로 넣고 http로 시작하지 않으면 /static/css/{$item}.css 의 item에 넣어줌
  }

  if (isset($this->js)) {
    foreach ($this->js as $item) {
      $src = strpos($item, "http") === 0 ? $item : "/static/js/{$item}.js";
      echo "<script defer src='{$src}'></script>";
    }
  }
  ?>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
  <script src="/static/js/common.js"></script>
</head>