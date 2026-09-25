import downloadMarkdown from "../../helpers/downloadMarkdown";

function DownloadButton({ body, slug, title }) {
  const handleClick = () => downloadMarkdown({ title, body, slug });

  return (
    <button className="btn btn-sm" onClick={handleClick}>
      <i className="ion-android-download"></i> Download
    </button>
  );
}

export default DownloadButton;
