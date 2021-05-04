import * as $ from 'jquery';
import Post from '@models/Post';
import WebpackLogo from '@/assets/webpack-logo.png';
import '@/styles/styles.css';

const post = new Post('Webpack Post Title', WebpackLogo);

$('pre').html(post.toString());
