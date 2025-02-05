import create from 'zustand';

    const useStore = create((set) => ({
      videos: null,
      loading: false,
      error: null,
      sortBy: 'date', // Default sort
      fetchVideos: async (channelUrl) => {
        set({ loading: true, error: null });
        try {
          // Extract channel ID from URL
          const channelId = extractChannelId(channelUrl);
          if (!channelId) {
            throw new Error('Invalid YouTube channel URL');
          }

          const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&key=YOUR_API_KEY`
          );

          const videos = response.data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default.url,
            uploadDate: item.snippet.publishedAt,
            viewCount: 0, // Placeholder, needs additional API call
            duration: '00:00', // Placeholder, needs additional API call
            description: item.snippet.description.substring(0, 100) + '...'
          }));

          set({ videos, loading: false });
        } catch (error) {
          set({ loading: false, error: error.message });
        }
      },
      setVideos: (videos) => set({ videos }),
      setSortBy: (sortBy) => set({ sortBy })
    }));

    const extractChannelId = (url) => {
      // Regular expression to extract channel ID from URL
      const match = url.match(/\/channel\/([^\/]+)/);
      return match ? match[1] : null;
    };

    export { useStore };
