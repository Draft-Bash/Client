import '../../../css/draftRoom/center/draftCenter.css';
import CenterHeader from './CenterHeader';
import PlayersTable from './PlayersTable';

const DraftCenter = () => {

  return (
    <div className="draft-center">
      <CenterHeader />
      <PlayersTable />
    </div>
  )
};

export default DraftCenter;