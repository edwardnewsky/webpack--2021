import * as $ from 'jquery';
import Post from '@models/Post';
import WebpackLogo from '@/assets/webpack-logo.png';
import '@/styles/styles.css';
import '@/styles/less.less';

const post = new Post('Webpack Post Title', WebpackLogo);

$('pre').addClass('code').html(post.toString());
