import { Routes, Route } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import {
  HomePage,
  Step1Page,
  Step2Page,
  Step3Page,
  Step4Page,
  TiebreakerPage,
  NotFoundPage,
} from './pages';

const App = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="step1" element={<Step1Page />} />
          <Route path="step2" element={<Step2Page />} />
          <Route path="step3" element={<Step3Page />} />
          <Route path="tiebreaker" element={<TiebreakerPage />} />
          <Route path="step4" element={<Step4Page />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
