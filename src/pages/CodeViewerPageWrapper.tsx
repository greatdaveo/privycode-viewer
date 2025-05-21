import { useParams } from "react-router-dom";
import { ViewerPage } from "./ViewerPage";

const CodeViewerPageWrapper = () => {
  const { token } = useParams<{ token: string }>();

  if (!token) return <p>Invalid token</p>;

  return <ViewerPage token={token} />;
};

export default CodeViewerPageWrapper;
