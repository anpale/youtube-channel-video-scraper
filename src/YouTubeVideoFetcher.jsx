import React, { useState } from 'react';
    import axios from 'axios';
    import { Container, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

    const YouTubeVideoFetcher = () => {
      const [channelName, setChannelName] = useState('');
      const [videos, setVideos] = useState([]);
      const [error, setError] = useState('');

      const fetchChannelId = async (name) => {
        const apiKey = 'AIzaSyBZ_3LUw33y9DbKc1JDehsO0Cz49XQImSg'; // Replace with your YouTube API key
        const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
        const params = {
          part: 'snippet',
          q: name,
          type: 'channel',
          key: apiKey,
        };

        try {
          const response = await axios.get(apiUrl, { params });
          if (response.data.items.length > 0) {
            return response.data.items[0].snippet.channelId;
          } else {
            throw new Error('Channel not found');
          }
        } catch (err) {
          console.error('Error fetching channel ID:', err.message);
          throw new Error('Failed to fetch channel ID. Please check the channel name and try again.');
        }
      };

      const fetchVideos = async (channelId) => {
        const apiKey = 'YOUR_YOUTUBE_API_KEY'; // Replace with your YouTube API key
        const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
        const params = {
          part: 'snippet',
          channelId: channelId,
          maxResults: 5, // Adjust the number of results as needed
          order: 'date',
          type: 'video',
          key: apiKey,
        };

        try {
          const response = await axios.get(apiUrl, { params });
          const videoData = response.data.items.map((item) => ({
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt,
          }));
          setVideos(videoData);
          setError('');
        } catch (err) {
          console.error('Error fetching videos:', err.message);
          setError('Failed to fetch videos. Please try again later.');
        }
      };

      const handleSearch = async () => {
        try {
          const channelId = await fetchChannelId(channelName);
          await fetchVideos(channelId);
        } catch (err) {
          setError(err.message);
        }
      };

      return (
        <Container maxWidth="sm">
          <Typography variant="h5" component="h2" gutterBottom>
            YouTube Video Fetcher
          </Typography>
          <TextField
            label="YouTube Channel Name or Handle"
            variant="outlined"
            fullWidth
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search and Fetch Videos
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          <List>
            {videos.map((video, index) => (
              <ListItem key={index}>
                <ListItemText primary={video.title} secondary={new Date(video.publishedAt).toLocaleDateString()} />
              </ListItem>
            ))}
          </List>
        </Container>
      );
    };

    export default YouTubeVideoFetcher;
