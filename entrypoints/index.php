<?php
require_once '../vendor/autoload.php';

$loader = new Twig_Loader_Filesystem('../templates');
$twig = new Twig_Environment($loader, array(
    'cache' => '../compilation_cache',
));


$routes = array(
	'/gallery/([^/]+)/?' => 'gallery',
);

foreach ( $routes as $pattern => $action ) {
	$pattern = "/" . str_replace( "/", "\\/", $pattern ) . "/";
	$url = $_SERVER['REQUEST_URI'];
	if ( preg_match( $pattern, $url, $m ) ) {
		call_user_func_array( $action, array_slice( $m, 1 ) );
		break;
	}
}



function gallery( $g ) {
	global $twig;

	$dir = "../www/images/gallery/" . $g . "/thumb/";
	$images = array();

	if (is_dir($dir)) {
	    if ($dh = opendir($dir)) {
		while (($file = readdir($dh)) !== false) {
		    if ( substr( $file, -4 ) == ".jpg" ) {
			$images[] = $file;
		    }
		}
		closedir($dh);
	    }
	}

	sort( $images );


	$vars = array();
	$vars['images'] = $images;

	echo $twig->render('gallery/' . $g . '.html', $vars );
}

	




?>
