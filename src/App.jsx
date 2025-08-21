import React, { useState } from 'react';
import { Upload, Button, Card, message, notification } from 'antd';
import { CloudUploadOutlined, CheckOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import './App.css';

const { Dragger } = Upload;

function App() {
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf,.doc,.docx,.txt',
    fileList,
    onChange(info) {
      const { status } = info.file;
      setFileList(info.fileList.slice(-1));
      
      if (status !== 'uploading') {
        setFileName(info.file.name);
        message.success(`${info.file.name} 文件选择成功`);
      }
    },
    beforeUpload: (file) => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'application/msword' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                         file.type === 'text/plain';
      
      const isLt10M = file.size / 1024 / 1024 < 10;
      
      if (!isValidType) {
        message.error('只能上传 PDF、DOC、DOCX 或 TXT 格式的文件!');
        return false;
      }
      
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB!');
        return false;
      }
      
      setFileName(file.name);
      return false;
    },
    onDrop: () => setDragOver(false),
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
  };

  const handleLastStep = () => {
    notification.info({
      message: '返回上一步',
      description: '正在返回上一步...',
    });
  };

  const handleFinish = () => {
    if (!fileName) {
      message.warning('请先选择一个简历文件');
      return;
    }
    notification.success({
      message: '完成!',
      description: `简历 "${fileName}" 已成功提交`,
      duration: 3,
    });
  };

  const removeFile = () => {
    setFileList([]);
    setFileName('');
    message.info('文件已移除');
  };

  return (
    <div className="app">
      <div className="container">

        <div className="left-section">
          <div className="content">
            <h1 className="title">Finish!</h1>
            <h2 className="subtitle">Upload Your Resume</h2>
            <p className="description">
              Upload your resume, the platform will help you parse and optimize, you 
              can also skip this step
            </p>
          </div>

        </div>


        <div className="right-section">
          <Card className="upload-card">
            <div className="upload-content">
              <h3 className="upload-title">Upload file</h3>
              
              <Dragger 
                {...uploadProps} 
                className={`upload-dragger ${dragOver ? 'drag-over' : ''}`}
              >
                <div className="upload-icon">
                  <CloudUploadOutlined />
                </div>
                <p className="upload-text">
                  Drag your resume file to this area, or click on the area to select 
                  the appropriate file to upload
                </p>
                <p className="upload-hint">
                  Support for PDF, DOC, DOCX, TXT files (max 10MB)
                </p>
              </Dragger>

              {fileName && (
                <div className="uploaded-file">
                  <div className="file-info">
                    <FileTextOutlined />
                    <span className="file-name">{fileName}</span>
                    <Button 
                      type="text" 
                      icon={<DeleteOutlined />} 
                      size="small"
                      onClick={removeFile}
                      className="remove-btn"
                    />
                  </div>
                </div>
              )}

              <div className="button-group">
                <Button 
                  className="last-step-btn" 
                  size="large"
                  onClick={handleLastStep}
                >
                  Last step
                </Button>
                <Button 
                  type="primary" 
                  className="finish-btn" 
                  size="large"
                  onClick={handleFinish}
                >
                  Finish
                </Button>
              </div>

              <div className="progress-section">
                <div className="progress-bar">
                  <div className="progress-step completed">
                    <CheckOutlined />
                  </div>
                  <div className="progress-line completed"></div>
                  <div className="progress-step completed">
                    <CheckOutlined />
                  </div>
                  <div className="progress-line active"></div>
                  <div className="progress-step active">
                    3
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;