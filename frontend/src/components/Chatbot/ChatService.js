// ChatService.js
// Flask 백엔드와 통신하는 서비스 레이어

const API_BASE_URL = 'http://localhost:5000';

class ChatService {
  /**
   * 이미지 업로드 및 객체 감지
   * @param {File} imageFile - 업로드할 이미지 파일
   * @returns {Promise<Object>} 감지 결과 데이터
   */
  async uploadAndDetect(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`${API_BASE_URL}/detect`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // 세션 쿠키 포함
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        uploadImage: data.upload_image,
        detected: data.detected,
        classes: data.classes,
      };
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 특정 클래스의 Top3 추천 가구 가져오기
   * @param {string} className - 클래스명 (예: 'bed', 'chair', 'couch')
   * @returns {Promise<Object>} Top3 추천 결과
   */
  async getTop3Recommendations(className) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/top3?class=${encodeURIComponent(className)}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        top3: data.top3,
      };
    } catch (error) {
      console.error('Top3 fetch error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * AI 챗봇에게 메시지 전송
   * @param {string} message - 사용자 메시지
   * @returns {Promise<Object>} AI 응답 데이터
   */
  async sendChatMessage(message) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        reply: data.reply,
        top3: data.top3 || null,
      };
    } catch (error) {
      console.error('Chat message error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 로컬 파일 URL 생성
   * @param {string} path - 파일 경로
   * @returns {string} 완전한 URL
   */
  getLocalFileUrl(path) {
    if (path.startsWith('http')) {
      return path;
    }
    return `${API_BASE_URL}${path}`;
  }
}

// 싱글톤 인스턴스 export
export default new ChatService();