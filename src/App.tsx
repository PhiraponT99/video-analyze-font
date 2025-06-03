import React, { useState } from 'react';
import axios from 'axios';
import { SpeedInsights } from "@vercel/speed-insights/react"; // เพิ่มบรรทัดนี้

const API_URL = 'https://video-analyzer-api.onrender.com/analyze'; // เปลี่ยนเป็น endpoint จริง

type AnalysisResultObj = {
  score: number;
  suggestion: string;
};
type AnalysisResult = AnalysisResultObj | string | null;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState('');
  const [result, setResult] = React.useState<AnalysisResult>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      console.error('No file selected');
      return;
    }
    if (!topic) return;

    const formData = new FormData();
    formData.append('video', file);
    formData.append('expected_topic', topic);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    console.log('file:', file);
    console.log('topic:', topic);
    console.log('file instanceof File:', file instanceof File);

    try {
      const res = await axios.post(API_URL, formData); // ไม่ต้องใส่ headers
      setResult(res.data.result);
    } catch (err) {
      console.error('Error during video analysis:', err);
      setResult('เกิดข้อผิดพลาด');
    }
  };

  return (
    <>
      <SpeedInsights /> {/* เพิ่มตรงนี้ */}
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#e9ecef' }}>
        <div className="card p-4 shadow" style={{ minWidth: 350, maxWidth: 400, border: '2px solid #2563eb' }}>
          <h3 className="mb-3 text-center">AI Video Analyzer</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="expected-topic">Expected Topic</label>
              <input
                id="expected-topic"
                type="text"
                className="form-control"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="หัวข้อที่คาดหวัง"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="upload-video">Upload Video</label>
              <input
                id="upload-video"
                type="file"
                className="form-control"
                accept="video/*"
                onChange={e => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">Analyze</button>
          </form>
          {result && typeof result === 'object' && result !== null && 'score' in result && 'suggestion' in result ? (
            <div className="alert alert-info mt-3">
              <div>Score: {(result as AnalysisResultObj).score}</div>
              <div>Suggestion: {(result as AnalysisResultObj).suggestion}</div>
            </div>
          ) : result && (
            <div className="alert alert-info mt-3">{result}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
