import Post from '@models/Post';
import WebpackLogo from '@/assets/webpack-logo.png';
import '@/styles/styles.css';

const post = new Post('Webpack Post Title', WebpackLogo);

console.log('Post to String', post.toString());
