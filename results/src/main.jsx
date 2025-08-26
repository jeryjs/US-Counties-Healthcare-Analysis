import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const isLandscape = window.innerWidth > window.innerHeight;
const isDesktop = !/Mobi|Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

if (!isLandscape || !isDesktop) {
  alert('For the best experience, please use this page on a desktop or laptop in landscape mode.');
}

createRoot(document.getElementById('root')).render(
  <App />
)
