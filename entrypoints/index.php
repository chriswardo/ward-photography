<?php
require_once '../vendor/autoload.php';

$routes = array(
	'/gallery/([^/]+)/?' => 'gallery',
	'/?' => 'home',
);
$nav = array(
	
	array( "url" => "/", "title" => "Home" ),
	array( "url" => "/gallery/made-for-water", "title" => "Made for Water" ),
	array( "url" => "/gallery/men-at-sea", "title" => "Men at Sea" ),
	array( "url" => "/gallery/american-west", "title" => "American West" ),
	array( "url" => "/gallery/ko-lanta-gasoline", "title" => "Ko Lanta's Gasoline" ),
);
foreach ( $nav as $i => $n ) {
	$nav[$i]['active'] = ( $n['url'] == $_SERVER['REQUEST_URI'] );
}

$vars = array();
$vars['nav'] = $nav;


$loader = new Twig_Loader_Filesystem('../templates');
$twig = new Twig_Environment($loader, array(
    'cache' => '../compilation_cache',
));

foreach ( $routes as $pattern => $action ) {
	$pattern = "/" . str_replace( "/", "\\/", $pattern ) . "/";
	$url = $_SERVER['REQUEST_URI'];
	if ( preg_match( $pattern, $url, $m ) ) {
		call_user_func_array( $action, array_slice( $m, 1 ) );
		break;
	}
}

function home( ) {
	global $twig, $vars;
	echo $twig->render('home.html', $vars );

}

function gallery( $g ) {
	global $twig, $vars;

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

	$vars['images'] = $images;
	//var_dump( $vars ); exit;

	echo $twig->render('gallery/' . $g . '.html', $vars );
}

	




?>
