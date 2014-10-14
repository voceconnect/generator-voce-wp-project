<?php

$_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( !$_tests_dir ) {
	$_tests_dir = '/tmp/wordpress-tests-lib';
}

define( 'WP_CONTENT_DIR', dirname( dirname( __FILE__ ) ) . '/wp-content' );
define( 'WP_DEFAULT_THEME', '<%= themeName %>' );

require_once $_tests_dir . '/includes/functions.php';

$return_theme = function() {
	return '<%= themeSlug %>';
};

tests_add_filter( 'template', $return_theme);
tests_add_filter( 'stylesheet', $return_theme);

require $_tests_dir . '/includes/bootstrap.php';