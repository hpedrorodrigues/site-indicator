import React from 'react';
import { createRoot } from 'react-dom/client';

import Popup from './Popup';

import './index.css';

const container = document.getElementById('root');
createRoot(container!).render(<Popup />);
