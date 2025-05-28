// import React from 'react';
// import { DashboardContextProvider } from './context/DashboardContextProvider';
// import LoaderContextProvider from './context/LoaderContextProvider';
// import ErrorMessageContextProvider from './context/ErrorMessageContextProvider';
// import store from './store';
// import { Provider } from 'react-redux';
// import AppNavigation from './routes';
// import './App.css';
// import { Toaster } from 'react-hot-toast';

// function App() {
//   return (
//     <DashboardContextProvider>
//       <ErrorMessageContextProvider>
//         <LoaderContextProvider>
//           <Provider store={store}>
//             {/* Removed BrowserRouter as we're using custom navigation */}
//             <AppNavigation />
//             <Toaster />
//           </Provider>
//         </LoaderContextProvider>
//       </ErrorMessageContextProvider>
//     </DashboardContextProvider>
//   );
// }

// export default App;



import React, { useEffect } from 'react';
import { DashboardContextProvider } from './context/DashboardContextProvider';
import LoaderContextProvider from './context/LoaderContextProvider';
import ErrorMessageContextProvider from './context/ErrorMessageContextProvider';
import store from './store';
import { Provider } from 'react-redux';
import AppNavigation from './routes';
import './App.css';
import { Toaster } from 'react-hot-toast';

function App() {
  useEffect(() => {
    // Prevent zoom on input focus for mobile devices
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        e.target.style.fontSize = '16px';
      });
    });

    // Cleanup function to remove event listeners
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', (e) => {
          e.target.style.fontSize = '16px';
        });
      });
    };
  }, []);

  return (
    <DashboardContextProvider>
      <ErrorMessageContextProvider>
        <LoaderContextProvider>
          <Provider store={store}>
            {/* Removed BrowserRouter as we're using custom navigation */}
            <AppNavigation />
            <Toaster />
          </Provider>
        </LoaderContextProvider>
      </ErrorMessageContextProvider>
    </DashboardContextProvider>
  );
}

export default App;