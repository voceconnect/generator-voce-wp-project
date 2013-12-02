<?php

if ( ! isset( $content_width ) ) {
	$content_width = 780;
}

function _setup_<%= _.slugify(themeName).replace('-', '_') %>() {
	//add theme setup code here
}
add_action('after_setup_theme', '_setup_<%= _.slugify(themeName).replace('-', '_') %>');


function _enqueue_scripts_<%= _.slugify(themeName).replace('-', '_') %>() {
	if(!is_admin()) {
		if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) {
			wp_enqueue_script( '<%= _.slugify(themeName) %>-script', get_template_directory_uri() . '/js/main.js', array( 'jquery' ), null, true );
		} else {
			wp_enqueue_script( '<%= _.slugify(themeName) %>-script', get_template_directory_uri() . '/js/main.min.js', array( 'jquery' ), null, true );
		}
	}
}
add_action('wp_enqueue_scripts', '_enqueue_scripts_<%= _.slugify(themeName).replace('-', '_') %>');