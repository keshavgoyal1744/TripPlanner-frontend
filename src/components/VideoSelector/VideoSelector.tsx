import {
  Box,
  Checkbox,
  CircularProgress,
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ChangeEvent, Dispatch, useEffect, useState } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import { checkTikTokUrl, cleanTikTokVideoURL } from "../../utils/utils";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import DeleteIcon from "@mui/icons-material/Delete";
import { TikTokVideoObject } from "../../utils/types";
import { extendTheme as extendJoyTheme } from "@mui/joy/styles";
import { deepmerge } from "@mui/utils";
import { Send } from "@mui/icons-material"; // Import icon for button
interface VideoSelectorProps {
  videos: Map<string, TikTokVideoObject>;
  setVideos: Dispatch<React.SetStateAction<Map<string, TikTokVideoObject>>>;
}

const joyTheme = extendJoyTheme({
  cssVarPrefix: "mui",
});

const muiTheme = extendMuiTheme();

const theme = deepmerge(joyTheme, muiTheme);

/**
 * Return a Stepper with multiple different ReactNodes as its steps
 */
export default function VideoSelector({
  videos,
  setVideos,
}: VideoSelectorProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [vid, setVid] = useState<string>("");
  const [listVid, setListVid] = useState<TikTokVideoObject[]>(
    JSON.parse(localStorage.getItem("listVid") ?? "[]")
  );
  const [vidIds, setVidIds] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem("vidIds") ?? "[]"))
  );
  const [addingVid, setAddingVid] = useState<boolean>(false);

  useEffect(() => {
    // update videos here too
    setVideos((prev) => {
      const newVideos = new Map<string, TikTokVideoObject>();
      prev.forEach((videoObj) => {
        if (vidIds.has(videoObj.id)) {
          newVideos.set(videoObj.id, videoObj);
        }
      });
      return newVideos;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("listVid", JSON.stringify(listVid));
  }, [listVid]);

  useEffect(() => {
    localStorage.setItem("vidIds", JSON.stringify([...vidIds]));
  }, [vidIds]);

  const handleVid = (event: ChangeEvent<HTMLInputElement>) => {
    setVid(event.target.value);
  };

  /**
   * Chạy khi click upload button
   */
  const handleAddVid = async () => {
    console.log("Adding vid");
    setAddingVid(true);
    if (vid.length === 0) {
      alert("Empty");
      setAddingVid(false);
      return;
    }
    const input = vid;
    console.log("cleaning vid");

    const extractedVid = cleanTikTokVideoURL(input);
    console.log("cleaning vid done");

    if (typeof extractedVid === "string") {
      alert("Invalid TikTok URL");
    } else if (vidIds.has(extractedVid.id)) {
      alert("Already exists");
    } else {
      console.log("Checking exsistence");
      const isExist = await checkTikTokUrl(extractedVid.url);
      console.log("Done");

      if (!isExist) {
        alert("This TikTok URL does not exist");
        return;
      }

      setListVid([...listVid, extractedVid]);
      setVidIds((prev) => {
        const newVidIds = new Set(prev);
        newVidIds.add(extractedVid.id);
        return newVidIds;
      });
      setVid("");
    }
    setAddingVid(false);
  };

  // const deleteVideo = (index: number) => {
  //   setListVid((prevListVid) => prevListVid.filter((_, i) => i !== index));
  // }

  const handleDeleteVid = (index: number, video: TikTokVideoObject) => {
    setListVid((prevListVid) => prevListVid.filter((_, i) => i !== index));
    setVidIds((prev) => {
      const newVidIds = new Set(prev);
      newVidIds.delete(video.id);
      return newVidIds;
    });
    setVideos((prev) => {
      const newVideos = new Map(prev);
      newVideos.delete(video.id);
      return newVideos;
    });
  };

  const handleChangeVid = (video: TikTokVideoObject) => {
    if (videos.has(video.id)) {
      setVideos((prev) => {
        const newVideos = new Map(prev);
        newVideos.delete(video.id);
        return newVideos;
      });
    } else {
      setVideos((prev) => {
        const newVideos = new Map(prev);
        newVideos.set(video.id, video);
        return newVideos;
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: 1500,
        width: "100%",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          marginTop: 3,
          width: "100%",
          background: "#28282B",
          maxWidth: 1000,
        }}
      >
        <Typography variant="h6">Your TikTok video library</Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          You selected {videos.size} out of {listVid.length} video
          {listVid.length > 1 ? "s" : ""}.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={11}>
            <TextField
              id="location"
              placeholder="https://www.tiktok.com/@drinklinknyc/video/7374836750948076846"
              label="Your favorite TikTok review video URL"
              variant="outlined"
              fullWidth
              required
              value={vid}
              onChange={handleVid}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton
              size={isMobile ? "medium" : "large"}
              // sx={{ ...(isMobile && { display: "inline-block" }) }}
              color="primary"
              disabled={addingVid}
              onClick={handleAddVid}
            >
              {addingVid ? <CircularProgress color="primary" /> : <Send />}
            </IconButton>
          </Grid>
        </Grid>

        <Paper
          elevation={3}
          sx={{
            padding: 3,
            borderRadius: 2,
            marginTop: 3,
            width: "100%",
            background: "#131314",
            maxWidth: 1000,
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              flexGrow: 1,
              height: 750,
              overflowY: "auto",
              padding: 2,
            }}
            // xs={{
            //   margin: 0,
            // }}
          >
            {listVid.length > 0 ? (
              <>
                {listVid.map((video, index) => (
                  <Grid
                    padding="0"
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={`added-video-${index}`}
                    sx={{ padding: 0 }}
                  >
                    {/* Display video using this component */}
                    <CssVarsProvider theme={theme}>
                      <AspectRatio ratio="9/16">
                        <iframe
                          src={`https://www.tiktok.com/player/v1/${video.id}?rel=0&description=1`}
                          style={{ borderRadius: "inherit" }}
                        />
                      </AspectRatio>
                    </CssVarsProvider>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={videos.has(video.id)}
                            onChange={() => {
                              handleChangeVid(video);
                            }}
                            color="secondary"
                          />
                        }
                        label={
                          videos.has(video.id) ? (
                            <Typography color="secondary">
                              Added to the trip!
                            </Typography>
                          ) : (
                            <Typography>Add to the trip!</Typography>
                          )
                        }
                      />
                      <IconButton
                        color="primary"
                        onClick={() => {
                          handleDeleteVid(index, video);
                        }}
                        disableRipple={true}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </>
            ) : (
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  maxWidth: 400,
                  margin: "auto",
                  padding: 4,
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <SlowMotionVideoIcon
                  fontSize="inherit"
                  sx={{ fontSize: 40, color: "primary.main" }}
                />
                <Typography
                  variant="body1"
                  sx={{ marginTop: 2 }}
                  textAlign="center"
                >
                  Add your first TikTok here!
                </Typography>
              </Paper>
            )}
          </Grid>
        </Paper>
      </Paper>
    </Box>
  );
}
