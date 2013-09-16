<?php
if(file_exists(TEMPLATEPATH."/includes/options-init.php")) require_once TEMPLATEPATH."/includes/options-init.php";

if ( function_exists('register_sidebar') )  
    register_sidebar(array(  
        'before_widget' => '',  
        'after_widget' => '',  
        'before_title' => '<h2>',  
        'after_title' => '</h2>',  
    ));  
	add_theme_support( 'post-thumbnails' );
	add_filter( 'post_thumbnail_html', 'my_post_image_html', 10, 3 );
function my_post_image_html( $html, $post_id, $post_image_id ) {
	$html = '<a href="' . get_permalink( $post_id ) . '" title="' . esc_attr( get_post_field( 'post_title', $post_id ) ) . '">' . $html . '</a>';
	return $html;
}
add_theme_support('automatic-feed-links');


//update_option('siteurl','http://www.appwolf.com/blog');
//update_option('home','http://www.appwolf.com/blog');
?>  