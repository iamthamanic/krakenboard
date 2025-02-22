
import { useState } from 'react';
import { WebsiteScannerService } from './scanner/WebsiteScannerService';
import { useWebsiteScannerDB } from './scanner/useWebsiteScannerDB';
import { ScanProgress } from './types/scanner.types';

export const useWebsiteScanner = (websiteUrl?: string) => {
  const [scanning, setScanning] = useState(false);
  const { scanResult, isLoadingResults, saveScanResults } = useWebsiteScannerDB(websiteUrl);

  const startScan = async (url: string) => {
    setScanning(true);
    try {
      const scanner = new WebsiteScannerService(url);
      const pages = await scanner.scanWebsite();
      await saveScanResults({ url, pages });
    } finally {
      setScanning(false);
    }
  };

  return {
    scanResult,
    isLoadingResults,
    scanning,
    startScan
  };
};
