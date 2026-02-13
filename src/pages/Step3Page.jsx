import { useNavigate } from 'react-router-dom';
import Step3 from '../components/Step3';
import StepsLayout from '../layout/StepsLayout';

const Step3Page = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/step4');
  };

  const handleBack = () => {
    navigate('/step2');
  };

  return (
    <StepsLayout>
      <Step3 onNext={handleNext} onBack={handleBack} />
    </StepsLayout>
  );
};

export default Step3Page;
