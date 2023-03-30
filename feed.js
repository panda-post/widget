var container = document.createElement("div"); 
var linkToAdd = document.createElement("link")
var linkToAddTwo = document.createElement("link")



container.style.display = "flex";
container.style.flexDirection = "column";
container.style.width = "auto";
container.style.maxWidth = "650px";
container.style.minWidth = "200px";
container.style.height = "auto";
container.style.marginLeft = "auto";
container.style.marginRight = "auto";
container.style.overflow = "scroll";
container.style.padding = "15px";

container.setAttribute("id", "feedContainer");
const style = document.createElement('style');
style.textContent = `
  #feedContainer::-webkit-scrollbar {
    width:0px;
  }
a:hover {
   cursor:pointer;
}

.text-link{text-decoration:none;}

.text-link:hover {
    text-decoration:underline;       
}

.material-icons:hover {
    cursor:pointer;
}


.material-icons-outlined:hover {
    cursor:pointer;
}

.seeMoreButton:hover{
    cursor:pointer;
}

`;

//linkToAdd.href= "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,200,0,-25"
linkToAdd.href= "https://fonts.googleapis.com/icon?family=Material+Icons"
linkToAddTwo.href= "https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
linkToAdd.rel = 'stylesheet';
linkToAddTwo.rel = 'stylesheet';



var fullHtmlString = ""
var expandedPost = []


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

//This variable stores the unique id of the user viewing the feed
var flowPostUser;

//This creates the cookie for user 
function createUser() {
    flowPostUser = "id" + Math.random().toString(16).slice(2);
    document.cookie = `flowPostEmbedUser=${flowPostUser}`;
}

//Checks to see if cookie representing the user viewing the embedded feed has already been created. 
var existingUser = getCookie("flowPostEmbedUser");
if(!existingUser) {
    createUser();
}
else {
    flowPostUser = existingUser;
}

var likedPosts;

//get the initial liked posts from the cookie
likedPosts = getCookie("flowPostEmbedLikedPosts");


//This creates a new post like
async function createLike (post) {
    likedPosts = likedPosts + " " + post;
    document.cookie = `flowPostEmbedLikedPosts=${likedPosts}`;    
    //console.log(post)
    //console.log(flowPostUser)

    const heartIcon = document.getElementById(`span${post}`);
    heartIcon.className = "material-icons";
    heartIcon.style.color = "#EB2323";
    heartIcon.innerText = "favorite";
    
    const response = await fetch(`https://flow-post.bubbleapps.io/version-test/api/1.1/wf/like-post`, {
            method: "POST", 
            headers: {
                "Content-Type":"application/json"
            }, 
            body: JSON.stringify({
                post:post,
                user_id:flowPostUser
            })
        } );
        
        const data = await response.json();
        updateLikeText(data.post_like_count,post);
        return data;
}

//This dislikes a post that was already liked
async function deleteLike (post) {
    likedPosts = likedPosts.replaceAll(`${post}`, "");
    document.cookie = `flowPostEmbedLikedPosts=${likedPosts}`;

    const heartIcon = document.getElementById(`span${post}`);
    heartIcon.className = "material-icons-outlined";
    heartIcon.style.color = "#111111";
    heartIcon.innerText = "favorite_border";

    const response = await fetch(`https://flow-post.bubbleapps.io/version-test/api/1.1/wf/dislike-post`, {
            method: "POST", 
            headers: {
                "Content-Type":"application/json"
            }, 
            body: JSON.stringify({
                post:post,
                user_id:flowPostUser
            })
        } );
        
        const data = await response.json();
        updateLikeText(data.post_like_count,post);
        return data;
}


function getHeartIconSettings(uniqueIdPost) {
    var heartIconSettings = {
        class: "material-icons-outlined",
        text: "favorite_border",
        color: "#111111"
    };
    if(likedPosts.includes(uniqueIdPost)) {
        var heartIconSettings = {
            class: "material-icons",
            text:"favorite",
            color:"#EB2323"
        }
    }
    return heartIconSettings;
}

//This likes/dislikes post
async function toggleLike(post) {
  if(likedPosts.includes(post)) {
    await deleteLike(post);
  } else {
    await createLike(post);
  }
}


//This update HTML like count
function updateLikeText(likeCount,post) {
  const likeTextElement = document.getElementById(`like_count${post}`);
  if (likeCount === 1) {
    likeTextElement.innerText = "1 like";
  } else {
    likeTextElement.innerText = `${likeCount} likes`;
  }
}

//This creates a new embed click 
async function createEmbedClick (post) {
        const response = await fetch(`https://flow-post.bubbleapps.io/version-test/api/1.1/wf/embed-link-click`, {
            method: "POST", 
            headers: {
                "Content-Type":"application/json"
            }, 
            body: JSON.stringify({
                post:post
            })
        } );
        
        const data = await response.json();
        return data;
}

async function goToPage(post,link) {
    await createEmbedClick(post)
    window.open(link)
}



//This creates the time stamp post
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const currentDate = new Date();
    const timeDiff = (currentDate - date)/1000/60; //time difference in minutes
    console.log(timeDiff);
    if(timeDiff < 1) {
        return "Just Now";
    }
    if(timeDiff >= 1 && timeDiff < 60) {
        if(timeDiff < 2) {
            return `${Math.floor(timeDiff)} minute ago`
        }
        return `${Math.floor(timeDiff)} minutes ago`
    }
    if(timeDiff >= 60 && timeDiff < 1440) { //24 hours / day * 60 minutes / hour = 1440 minutes / day
        if(timeDiff < 120) {
            return `${Math.floor(timeDiff/60)} hour ago`
        }
        return `${Math.floor(timeDiff/60)} hours ago`
    }
    if(timeDiff >= 1440 && timeDiff < 43200) { //24 hours/day  60 minutes / hour  30 days / month = 43200 minutes / month
        if(timeDiff < 2880) {
            return `${Math.floor(timeDiff/60/24)} day ago`;
        } 
        return `${Math.floor(timeDiff/60/24)} days ago`;
    }
    if(timeDiff >= 43200) {
        if(timeDiff < 86400) {
            return `${Math.floor(timeDiff/60/24/30)} month ago`;
        }
        return `${Math.floor(timeDiff/60/24/30)} months ago`;
    }
    console.log(timeDiff);
}


function getTimeDifference(event_start_time, event_end_time) {
    const startDate = new Date(event_start_time)
    const endDate = new Date(event_end_time)
    const minDiff = Math.floor((endDate - startDate)/(1000*60));
    console.log(minDiff);
    if (minDiff > 60) {
        return `${Math.floor(minDiff/60)} hr`;
    } else {
        return `${minDiff} min`;
    }
}

function getTime(dateString) {
    const date = new Date(dateString);
    var hour = date.getHours();
    var mins = date.getMinutes();
    if (mins < 10) {
        mins = "0" + mins;
    }
    if(hour === 0) {
        hour = 12;
    } 
    if (hour > 12) {
        return `${hour - 12}:${mins} pm`;
    } else {
        return `${hour}:${mins} am`;
    }
}

function getDate(dateText) {
    const date = new Date(dateText);
    const monthNum = date.getMonth(); //returns a number 0 - 11 fmor the month
    const months = [
        {
            month:"January",
            number:0
        },
        {
            month:"February",
            number:1
        },
        {
            month:"March",
            number:2
        },
        {
            month:"April",
            number:3
        },
        {
            month:"May",
            number:4
        },
        {
            month:"June",
            number:5
        },
        {
            month:"July",
            number:6
        },
        {
            month:"August",
            number:7
        },
        {
            month:"September",
            number:8
        },
        {
            month:"October",
            number:9
        },
        {
            month:"November",
            number:10
        },
        {
            month:"December",
            number:11
        }
    ];
    const month = months.find(x => x.number === monthNum).month;
    //console.log(month);
    const day = date.getDate();
    //console.log(day);
    var append;
    if(day === 1 || day === 21 || day === 31) {
        append = "st";
    }
    if(day === 2 || day === 22) {
        append = "nd";
    }
    if(day === 3 || day === 23) {
        append = "rd";
    }
    if(append === undefined) {
        append = "th";
    }
    return month + " " + day + append;
}

function getAbbreviatedDate(dateText) {
    const date = new Date(dateText);
    const monthNum = date.getMonth(); //returns a number 0 - 11 fmor the month
    const months = [
        {
            month:"JAN",
            number:0
        },
        {
            month:"FEB",
            number:1
        },
        {
            month:"MAR",
            number:2
        },
        {
            month:"APR",
            number:3
        },
        {
            month:"MAY",
            number:4
        },
        {
            month:"JUN",
            number:5
        },
        {
            month:"JUL",
            number:6
        },
        {
            month:"AUG",
            number:7
        },
        {
            month:"SEP",
            number:8
        },
        {
            month:"OCT",
            number:9
        },
        {
            month:"NOV",
            number:10
        },
        {
            month:"DEC",
            number:11
        }
    ];
    const month = months.find(x => x.number === monthNum).month;
    //console.log(month);
    const day = date.getDate();
    //console.log(day);
    var append;
    if(day === 1 || day === 21 || day === 31) {
        append = "st";
    }
    if(day === 2 || day === 22) {
        append = "nd";
    }
    if(day === 3 || day === 23) {
        append = "rd";
    }
    if(append === undefined) {
        append = "th";
    }
    return month + " " + day + append;
}

//This creates the date header
function createDateHeader(date,headerColor) {
    
    const formattedDate = getDate(date);
    const htmlString = `<h2 style="color:${headerColor}; font-size:1.25em; font-weight:600; text-align:left; height:fit-content; font-family: 'Inter', sans-serif;" margin:5px 0px 15px 0px !important;"> ${formattedDate} </h2>`
    fullHtmlString = fullHtmlString + htmlString
}


//This decodes or unesacpes the HTML <a> tags that were returned by the Flowpost API
function unescapeHtml(html) {
    return html.replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#10;/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&#13;/g, "\r")
}

//This hides the see more button and expands the text to max height
function expandText(postId) {
    const seeMoreButton = document.getElementById(`seeMore${postId}`);
    seeMoreButton.style.display = 'none';
    const text = document.getElementById(`text${postId}`);
    text.style.maxHeight = 'none';
}


//This creates the text post
function createTextPost(post_date,body,post_id,like_count) {

    const convertedBody = unescapeHtml(body);
    const timeAgo = getTimeAgo(post_date)
    var seeMoreButton = `<p onclick="expandText('${post_id}')" id="seeMore${post_id}" class="seeMoreButton" style="color:#111111; font-size: .875em; font-weight:600; padding: 0px 10px 0px 10px !important; text-align: left; font-family: 'Inter', sans-serif;" > See more...</p>`

    if (convertedBody.length < 300){
        seeMoreButton = ""
    }

    //within each function that creates the different post types which have a heart icon
    const heartIconSettings = getHeartIconSettings(post_id);

    var likeCountText;
        if(like_count === 1) {
        likeCountText = "1 like";
        } else {
        likeCountText = `${like_count} likes`;
        }

    const htmlString = 
    `<div class="text-post" style="display:flex; min-height:fit-content; flex-direction:column; width:100%; border-radius: 5px; margin:0px 0px 15px 0px !important; padding:0px !important; background: #FFFFFF; border: 1px solid #E9E9E9; box-shadow: 0px 0px 12px rgba(170, 170, 170, 0.25);">
        <div>
            <p style="color:#7D7D7D; font-size: 0.75em; margin:0px 0px 5px 0px !important; padding: 10px 10px 0px 10px !important; text-align: left; height: fit-content; font-family: 'Inter', sans-serif; font-weight:400;"> Posted ${timeAgo} </p>
            <p id="text${post_id}" style="color:#111111; font-size: .875em; font-weight:400; margin:0px 0px 20px 0px !important; padding: 0px 10px 0px 10px !important; text-align: left; height:fit-content; font-family: 'Inter', sans-serif; overflow:hidden; max-height:50px;"> ${convertedBody} </p>
            ${seeMoreButton}
        </div>  
        <div onclick="toggleLike('${post_id}')" style="display:flex; width:auto; height:fit-content; align-items: center; justify-content: start;  padding: 10px 10px 10px 10px !important; border-top:1px solid #ebebeb;"> 
            <span id="span${post_id}" class="${heartIconSettings.class}" style="margin:0px 5px 0px 0px; color:${heartIconSettings.color} !important; font-size:20px;">${heartIconSettings.text}</span> <p id="like_count${post_id}" style=" color:#111111; font-size: .875em; margin:0px 0px 0px 0px !important; font-family: 'Inter', sans-serif; text-align: left;" > ${likeCountText} </p>
        </div>  
    </div>`

fullHtmlString = fullHtmlString + htmlString
container.innerHTML = fullHtmlString


}

//This creates the link post
function createLinkPost(post_date, body, link_title,link,linkBgColor,post_id,like_count,primaryColor) {

    const timeAgo = getTimeAgo(post_date)
    var seeMoreButton = `<p onclick="expandText('${post_id}')" id="seeMore${post_id}" class="seeMoreButton" style="color:#111111; font-size: .875em; font-weight:600; padding: 0px 10px 0px 10px !important; text-align: left; font-family: 'Inter', sans-serif;" > See more...</p>`

    if (body.length < 300){
        seeMoreButton = ""
    }
    

      //within each function that creates the different post types which have a heart icon
      const heartIconSettings = getHeartIconSettings(post_id);

    var likeCountText;
        if(like_count === 1) {
        likeCountText = "1 like";
        } else {
        likeCountText = `${like_count} likes`;
        }

    var htmlString = 
    `<div style="display:flex; flex-direction:column; width:100%; height:fit-content; border-radius: 5px; margin:0px 0px 15px 0px !important; padding:0px !important; border: 1px solid #E9E9E9; box-shadow: 0px 0px 12px rgba(170, 170, 170, 0.25);">
        <div style= "padding:0px 0px 10px 0px !important; background: #FFFFFF; border-radius: 5px 5px 0px 0px; ">
            <p style="color:#7D7D7D; font-size: 0.75em;font-weight:500; margin:0px 0px 5px 0px !important; padding: 10px 10px 0px 10px !important; text-align: left; height: fit-content; font-family: 'Inter', sans-serif; font-weight:400;"> Posted ${timeAgo} </p>
            <p id="text${post_id}" style="color:#111111; font-size: .875em; font-weight:400; margin:0px 0px 20px 0px !important; padding: 0px 10px 0px 10px !important; text-align: left; height:fit-content; font-family: 'Inter', sans-serif; overflow:hidden; max-height:50px;"> ${body} </p>
            ${seeMoreButton}
        </div>
        <a onclick="goToPage('${post_id}','${link}')"  style="text-decoration: none; position: relative;">
            <div style=" height:fit-content; width:auto; padding:15px 10px 15px 10px !important;;  display: flex; align-items: center; justify-content: start; background-color:${linkBgColor}; border-radius: 0px 0px 5px 5px;">
                <div style= "width:auto; height:fit-content; padding:0px 0px 0px 0px !important;">
                    <h4 style="color:#111111; font-size: 1em; font-weight:600; text-align: left;  width:fit-content; height:fit-content; font-family: 'Inter', sans-serif; margin:0px 0px 5px 0px !important;"> ${link_title} </h4>
                    <p style="color:${primaryColor}; font-size: 0.875em; font-weight:400; text-align: left; height:fit-content; width:fit-content; font-family: 'Inter', sans-serif; margin:5px 0px 0px 0px !important;"> ${link} </p> 
                </div>        
           </div>
        </a>
        <div onclick="toggleLike('${post_id}')" style="display:flex; width:auto; height:fit-content; align-items: center; justify-content: start;  padding: 10px 10px 10px 10px !important; border-top:1px solid #ebebeb;"> 
            <span id="span${post_id}" class="${heartIconSettings.class}" style="margin:0px 5px 0px 0px; color:${heartIconSettings.color} !important; font-size:20px; ">${heartIconSettings.text}</span> <p id="like_count${post_id}" style=" color:#111111; font-size: .875em; margin:0px 0px 0px 0px !important; font-family: 'Inter', sans-serif; text-align: left;" > ${likeCountText} </p>
        </div> 
    </div>`
    if (!link) {
        htmlString = `<div style="display:flex; flex-direction:column; width:100%; min-height:fit-content; border-radius: 5px; margin:0px 0px 15px 0px !important; padding:0px !important; background: #FFFFFF; border: 1px solid #e9e9e9; box-shadow: 0px 0px 12px rgba(170, 170, 170, 0.25);">
        <div style= "padding:0px 0px 10px 0px !important; border-radius: 5px 5px 0px 0px;">
            <p style="color:#7D7D7D; font-size: 0.75em;font-weight:500; margin:0px 0px 5px 0px !important; padding: 10px 10px 0px 10px !important; text-align: left; height: fit-content; font-family: 'Inter', sans-serif; font-weight:400;"> Posted ${timeAgo} </p>
            <p id="text${post_id}" style="color:#111111; font-size: .875em; font-weight:400; margin:0px 0px 20px 0px !important; padding: 0px 10px 0px 10px !important; text-align: left; height:fit-content; font-family: 'Inter', sans-serif; overflow:hidden; max-height:50px;"> ${body} </p>
            ${seeMoreButton}
        </div>
        <div onclick="toggleLike('${post_id}')" style="display:flex; width:auto; height:fit-content; align-items: center; justify-content: start;  padding: 10px 10px 10px 10px !important; border-top:1px solid #ebebeb;"> 
            <span id="span${post_id}" class="${heartIconSettings.class}" style="margin:0px 5px 0px 0px; color:${heartIconSettings.color} !important; font-size:20px;">${heartIconSettings.text}</span> <p id="like_count${post_id}" style=" color:#111111; font-size: .875em; margin:0px 0px 0px 0px !important; font-family: 'Inter', sans-serif; text-align: left;" > ${likeCountText} </p>
        </div> 
        </div>`
       }

fullHtmlString = fullHtmlString + htmlString
container.innerHTML = fullHtmlString

}

//This creates the image post
function createImagePost(post_date, body, image_source, link_title,link, linkBgColor, post_id, like_count, primaryColor) {

const timeAgo = getTimeAgo(post_date)
var seeMoreButton = `<p onclick="expandText('${post_id}')" id="seeMore${post_id}" class="seeMoreButton" style="color:#111111; font-size: .875em; font-weight:600; padding: 0px 10px 0px 10px !important; text-align: left; font-family: 'Inter', sans-serif;" > See more...</p>`

    if (body.length < 300){
        seeMoreButton = ""
    }

  //within each function that creates the different post types which have a heart icon
      const heartIconSettings = getHeartIconSettings(post_id);

    var likeCountText;
        if(like_count === 1) {
        likeCountText = "1 like";
        } else {
        likeCountText = `${like_count} likes`;
        }

var htmlString = 
`<div style="display:flex; flex-direction:column; width:100%; height:fit-content; border-radius: 5px; margin:0px 0px 15px 0px !important; padding:0px !important; border: 1px solid #E9E9E9; box-shadow: 0px 0px 12px rgba(170, 170, 170, 0.25);">
    <div style= "padding:0px 0px 10px 0px !important; background: #FFFFFF; border-radius: 5px 5px 0px 0px;">
        <p style="color:#7D7D7D; font-size: 0.75em;font-weight:500; margin:0px 0px 5px 0px !important; padding: 10px 10px 0px 10px !important; text-align: left; height: fit-content; font-family: 'Inter', sans-serif; font-weight:400;"> Posted ${timeAgo} </p>
        <p id="text${post_id}" style="color:#111111; font-size: .875em; font-weight:400; margin:0px 0px 20px 0px !important; padding: 0px 10px 0px 10px !important; text-align: left; height:fit-content; font-family: 'Inter', sans-serif; overflow:hidden; max-height:50px;"> ${body} </p>
        ${seeMoreButton}
    </div>
    <a href onclick="goToPage('${post_id}','${link}')" style="text-decoration: none; position: relative;">
        <img class = "link-image" src ="${image_source}" style= "min-width: 200px; min-height: 100px; width: 100%; height: auto; display: block; object-fit: cover;"> 
        <div style=" height:fit-content; width:auto; padding:15px 10px 15px 10px !important;;  display: flex; align-items: center; justify-content: start; background-color:${linkBgColor}; border-radius: 0px 0px 5px 5px;">
                <div style= "width:auto; height:fit-content; padding:0px 0px 0px 0px !important;">
                    <h4 style="color:#111111; font-size: 1em; font-weight:600; text-align: left;  width:fit-content; height:fit-content; font-family: 'Inter', sans-serif; margin:0px 0px 5px 0px !important;"> ${link_title} </h4>
                    <p style="color:${primaryColor}; font-size: 0.875em; font-weight:400; text-align: left; height:fit-content; width:fit-content; font-family: 'Inter', sans-serif; margin:5px 0px 0px 0px !important;"> ${link} </p> 
                </div>        
           </div>
    </a>
    <div onclick="toggleLike('${post_id}')" style="display:flex; width:auto; height:fit-content; align-items: center; justify-content: start;  padding: 10px 10px 10px 10px !important; border-top:1px solid #ebebeb;"> 
            <span id="span${post_id}" class="${heartIconSettings.class}" style="margin:0px 5px 0px 0px; color:${heartIconSettings.color} !important; font-size:20px;">${heartIconSettings.text}</span> <p id="like_count${post_id}" style=" color:#111111; font-size: .875em; margin:0px 0px 0px 0px !important; font-family: 'Inter', sans-serif; text-align: left;" > ${likeCountText} </p>
        </div> 
</div>`
if (!link) {
        htmlString = `<div style="display:flex; flex-direction:column; width:100%; height:fit-content; border-radius: 5px; margin:0px 0px 15px 0px !important; padding:0px !important;  border: 1px solid #E9E9E9; box-shadow: 0px 0px 12px rgba(170, 170, 170, 0.25);">
    <div style= "padding:0px 0px 10px 0px !important; background: #FFFFFF; border-radius: 5px 5px 0px 0px;">
        <p style="color:#7D7D7D; font-size: 0.75em;font-weight:500; margin:0px 0px 5px 0px !important; padding: 10px 10px 0px 10px !important; text-align: left; height: fit-content; font-family: 'Inter', sans-serif; font-weight:400;"> Posted ${timeAgo} </p>
        <p id="text${post_id}" style="color:#111111; font-size: .875em; font-weight:400; margin:0px 0px 20px 0px !important; padding: 0px 10px 0px 10px !important; text-align: left; height:fit-content; font-family: 'Inter', sans-serif; overflow:hidden; max-height:50px;"> ${body} </p>
        ${seeMoreButton}
    </div>
    <img class = "link-image" src ="${image_source}" style= "min-width: 200px; min-height: 100px; width: 100%; height: auto; display: block; object-fit: cover;"> 
    <div onclick="toggleLike('${post_id}')" style="display:flex; width:auto; height:fit-content; align-items: center; justify-content: start;  padding: 10px 10px 10px 10px !important; border-top:1px solid #ebebeb;"> 
            <span id="span${post_id}" class="${heartIconSettings.class}" style="margin:0px 5px 0px 0px; color:${heartIconSettings.color} !important; font-size:20px;">${heartIconSettings.text}</span> <p id="like_count${post_id}" style=" color:#111111; font-size: .875em; margin:0px 0px 0px 0px !important; font-family: 'Inter', sans-serif; text-align: left;" > ${likeCountText} </p>
        </div> 
</div>`
       }

fullHtmlString = fullHtmlString + htmlString
container.innerHTML = fullHtmlString

}

//This creates the video post
function createVideoPost(post_date, body, video_source, link_title, link,linkBgColor, post_id, like_count, primaryColor) {

const timeAgo = getTimeAgo(post_date)
var seeMoreButton = `<p onclick="expandText('${post_id}')" id="seeMore${post_id}" class="seeMoreButton" style="color:#111111; font-size: .875em; font-weight:600; padding: 0px 10px 0px 10px !important; text-align: left; font-family: 'Inter', sans-serif;" > See more...</p>`

    if (body.length < 300){
        seeMoreButton = ""
    }


//within each function that creates the different post types which have a heart icon
const heartIconSettings = getHeartIconSettings(post_id);

var likeCountText;
    if(like_count === 1) {
    likeCountText = "1 like";
    } else {
    likeCountText = `${like_count} likes`;
    }

var htmlString = 
`<div style="display:flex; flex-direction:column; width:100%; height:fit-content; border-radius: 5px; margin:0px 0px 15px 0px !important; padding:0px !important; border: 1px solid #E9E9E9; box-shadow: 0px 0px 12px rgba(170, 170, 170, 0.25);">
    <div style= "padding:0px 0px 10px 0px !important; background: #FFFFFF; border-radius: 5px 5px 0px 0px;">
        <p style="color:#7D7D7D; font-size: 0.75em;font-weight:500; margin:0px 0px 5px 0px !important; padding: 10px 10px 0px 10px !important; text-align: left; height: fit-content; font-family: 'Inter', sans-serif; font-weight:400;"> Posted ${timeAgo} </p>
        <p id="text${post_id}" style="color:#111111; font-size: .875em; font-weight:400; margin:0px 0px 20px 0px !important; padding: 0px 10px 0px 10px !important; text-align: left; height:fit-content; font-family: 'Inter', sans-serif; overflow:hidden; max-height:50px;"> ${body} </p>
        ${seeMoreButton}
    </div>
    <video id="my-video" width="100%" height="auto" controls disablePictureInPicture style="width: 100%; height:auto; display: inline-block; position: relative; background-color: black; margin-left: auto; margin-right: auto;"> <source src="${video_source}" type=video/mp4></video>
    <a onclick="goToPage('${post_id}','${link}')" style="text-decoration: none; position: relative;">
        <div style=" height:fit-content; width:auto; padding:15px 10px 15px 10px !important;;  display: flex; align-items: center; justify-content: start; background-color: ${linkBgColor};">
                <div style= "width:auto; height:fit-content; padding:0px 0px 0px 0px !important;">
                    <h4 style="color:#111111; font-size: 1em; font-weight:600; text-align: left;  width:fit-content; height:fit-content; font-family: 'Inter', sans-serif; margin:0px 0px 5px 0px !important;"> ${link_title} </h4>
                    <p style="color:${primaryColor}; font-size: 0.875em; font-weight:400; text-align: left; height:fit-content; width:fit-content; font-family: 'Inter', sans-serif; margin:5px 0px 0px 0px !important;"> ${link} </p> 
                </div>        
        </div>
    </a>
    <div onclick="toggleLike('${post_id}')" style="display:flex; width:auto; height:fit-content; align-items: center; justify-content: start;  padding: 10px 10px 10px 10px !important; border-top:1px solid #ebebeb;"> 
        <span id="span${post_id}" class="${heartIconSettings.class}" style="margin:0px 5px 0px 0px; color:${heartIconSettings.color} !important;font-size:20px;">${heartIconSettings.text}</span> <p id="like_count${post_id}" style=" color:#111111; font-size: .875em; margin:0px 0px 0px 0px !important; font-family: 'Inter', sans-serif; text-align: left;" > ${likeCountText} </p>
    </div> 
</div>`
if (!link) {
    htmlString = `<div style="display:flex; flex-direction:column; width:100%; height:fit-content; border-radius: 5px; margin:0px 0px 15px 0px !important; padding:0px !important; border: 1px solid #E9E9E9; box-shadow: 0px 0px 12px rgba(170, 170, 170, 0.25);">
    <div style= "padding:0px 0px 10px 0px !important; background: #FFFFFF; border-radius: 5px 5px 0px 0px; ">
        <p style="color:#7D7D7D; font-size: 0.75em;font-weight:500; margin:0px 0px 5px 0px !important; padding: 10px 10px 10px 10px !important; text-align: left; height: fit-content; font-family: 'Inter', sans-serif; font-weight:400;"> Posted ${timeAgo} </p>
        <p id="text${post_id}" style="color:#111111; font-size: .875em; font-weight:400; margin:0px 0px 20px 0px !important; padding: 0px 10px 0px 10px !important; text-align: left; height:fit-content; font-family: 'Inter', sans-serif; overflow:hidden; max-height:50px;"> ${body} </p>
        ${seeMoreButton}
       </div>
    <video id="my-video" width="100%" height="auto" controls disablePictureInPicture style="width: 100%; height:auto; display: inline-block; position: relative; background-color: white; margin-left: auto; margin-right: auto;"> <source src="${video_source}" type=video/mp4 ></video>
    <div onclick="toggleLike('${post_id}')" style="display:flex; width:auto; height:fit-content; align-items: center; justify-content: start;  padding: 10px 10px 10px 10px !important; border-top:1px solid #ebebeb;"> 
            <span id="span${post_id}" class="${heartIconSettings.class}" style="margin:0px 5px 0px 0px; color:${heartIconSettings.color} !important; font-size:20px;">${heartIconSettings.text}</span> <p id="like_count${post_id}" style=" color:#111111; font-size: .875em; margin:0px 0px 0px 0px !important; font-family: 'Inter', sans-serif; text-align: left;" > ${likeCountText} </p>
    </div> 
</div>`
    
}

fullHtmlString = fullHtmlString + htmlString
container.innerHTML = fullHtmlString


}

//This creates the article post
function createArticlePost(post_date, sub_title, image_source, link_title, article_slug,linkBgColor,post_id, like_count, primaryColor) {

const timeAgo = getTimeAgo(post_date)
var seeMoreButton = `<p onclick="expandText('${post_id}')" id="seeMore${post_id}" class="seeMoreButton" style="color:#111111; font-size: .875em; font-weight:600; padding: 0px 10px 0px 10px !important; text-align: left; font-family: 'Inter', sans-serif;" > See more...</p>`

    if (sub_title.length < 300){
        seeMoreButton = ""
    }


//within each function that creates the different post types which have a heart icon
const heartIconSettings = getHeartIconSettings(post_id);

var likeCountText;
    if(like_count === 1) {
    likeCountText = "1 like";
    } else {
    likeCountText = `${like_count} likes`;
    }

const htmlString = 
`<div style="display:flex; flex-direction:column; width:100%; height:fit-content; border-radius: 5px; margin:0px 0px 15px 0px !important; padding:0px !important; border: 1px solid #E9E9E9; box-shadow: 0px 0px 12px rgba(170, 170, 170, 0.25);">
    <div style="padding:0px 0px 10px 0px !important; background: #FFFFFF; border-radius: 5px 5px 0px 0px;">
        <p style="color:#7D7D7D; font-size: 0.75em;font-weight:500; margin:0px 0px 5px 0px !important; padding: 10px 10px 0px 10px !important; text-align: left; height: fit-content; font-family: 'Inter', sans-serif; font-weight:400;"> Posted ${timeAgo} </p>
        <p id="text${post_id}" style="color:#111111; font-size: .875em; font-weight:400; margin:0px 0px 20px 0px !important; padding: 0px 10px 0px 10px !important; text-align: left; height:fit-content; font-family: 'Inter', sans-serif; overflow:hidden; max-height:50px;"> ${sub_title} </p>
        ${seeMoreButton}
    </div>
    <a onclick="goToPage('${post_id}','https://flowpost.app/article/${article_slug}')" style="text-decoration: none; position: relative;">
        <img src ="${image_source}" style= "min-width: 200px; min-height: 100px; width: 100%; height: auto; display: block; object-fit: cover;"> 
        <div style=" height:fit-content; width:auto; padding:15px 10px 15px 10px !important;;  display: flex; align-items: center; justify-content: start; background-color:${linkBgColor}; border-radius: 0px 0px 5px 5px;">
            <div style= "width:auto; height:fit-content; padding:0px 0px 0px 0px !important;">
                <h4 style="color:#111111; font-size: 1em; font-weight:600; text-align: left;  width:fit-content; height:fit-content; font-family: 'Inter', sans-serif;  margin:0px 0px 5px 0px !important;"> ${link_title} </h4>
                <p style="color:${primaryColor}; font-size: 0.875em; font-weight:400; text-align: left; height:fit-content; width:fit-content; font-family: 'Inter', sans-serif; margin:5px 0px 0px 0px !important;"> https://flowpost.app/article/${article_slug} </p> 
            </div>        
       </div>
    </a>
    <div onclick="toggleLike('${post_id}')" style="display:flex; width:auto; height:fit-content; align-items: center; justify-content: start;  padding: 10px 10px 10px 10px !important; border-top:1px solid #ebebeb;"> 
            <span id="span${post_id}" class="${heartIconSettings.class}" style="margin:0px 5px 0px 0px; color:${heartIconSettings.color} !important; font-size:20px;">${heartIconSettings.text}</span> <p id="like_count${post_id}" style=" color:#111111; font-size: .875em; margin:0px 0px 0px 0px !important; font-family: 'Inter', sans-serif; text-align: left;" > ${likeCountText} </p>
    </div>  
</div>`

fullHtmlString = fullHtmlString + htmlString
container.innerHTML = fullHtmlString

}

//This creates the event post
function createEventPost(post_date, body, event_start_time, event_title, location, image_source, link,linkBgColor,post_id, like_count, primaryColor) {

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const eventDate = getAbbreviatedDate(event_start_time)
    const eventHour = getTime(event_start_time)
    const timeAgo = getTimeAgo(post_date)
    var seeMoreButton = `<p onclick="expandText('${post_id}')" id="seeMore${post_id}" class="seeMoreButton" style="color:#111111; font-size: .875em; font-weight:600; padding: 0px 10px 0px 10px !important; text-align: left; font-family: 'Inter', sans-serif;" > See more...</p>`

    if (body.length < 300){
        seeMoreButton = ""
    }

//within each function that creates the different post types which have a heart icon
const heartIconSettings = getHeartIconSettings(post_id);

var likeCountText;
    if(like_count === 1) {
    likeCountText = "1 like";
    } else {
    likeCountText = `${like_count} likes`;
    }

    const htmlString = 
    `<div style="display:flex; flex-direction:column; width:100%; height:fit-content; border-radius: 5px; margin:0px 0px 15px 0px !important; padding:0px !important; background: #FFFFFF; border: 1px solid #E9E9E9; box-shadow: 0px 0px 12px rgba(170, 170, 170, 0.25);">
        <div>
            <p style="color:#7D7D7D; font-size: 0.75em;font-weight:500; margin:0px 0px 5px 0px !important; padding: 10px 10px 0px 10px !important; text-align: left; height: fit-content; font-family: 'Inter', sans-serif; font-weight:400;"> Posted ${timeAgo} </p>
            <p id="text${post_id}" style="color:#111111; font-size: .875em; font-weight:400; margin:0px 0px 20px 0px !important; padding: 0px 10px 0px 10px !important; text-align: left; height:fit-content; font-family: 'Inter', sans-serif; overflow:hidden; max-height:50px;"> ${body} </p>
        ${seeMoreButton}
        </div>   
            <a onclick="goToPage('${post_id}','${link}')" style="text-decoration: none; position: relative; ">
                <img src ="${image_source}" style= "min-width: 200px; min-height: 100px; width: 100%; height: auto; display: block; object-fit: cover;" > 
            <div style=" height:fit-content; width:auto; padding:15px 10px 15px 10px !important;;  display: flex; align-items: center; justify-content: start; background-color:${linkBgColor}; border-radius: 0px 0px 5px 5px;">
                <div style= "width:auto; height:fit-content; padding:0px 0px 0px 0px !important;">
                    <h4 style="color:#111111; font-size: 1em; font-weight:600; text-align: left;  width:fit-content; height:fit-content; font-family: 'Inter', sans-serif; margin:0px 0px 5px 0px !important;"> ${event_title} </h4>
                    <p style="color:${primaryColor}; font-size: 0.875em; font-weight:400; text-align: left; height:fit-content; width:fit-content; font-family: 'Inter', sans-serif; margin:5px 0px 0px 0px !important;"> ${eventDate} at ${eventHour} (${timeZone}) | ${location}  </p> 
                </div>
            </div>
            </a>
            <div onclick="toggleLike('${post_id}')" style="display:flex; width:auto; height:fit-content; align-items: center; justify-content: start;  padding: 10px 10px 10px 10px !important; border-top:1px solid #ebebeb;"> 
            <span id="span${post_id}" class="${heartIconSettings.class}" style="margin:0px 5px 0px 0px; color:${heartIconSettings.color} !important;">${heartIconSettings.text}</span> <p id="like_count${post_id}" style=" color:#111111; font-size: .875em; margin:0px 0px 0px 0px !important; font-family: 'Inter', sans-serif; text-align: left;" > ${likeCountText} </p>
    </div>  
    </div>`

fullHtmlString = fullHtmlString + htmlString
container.innerHTML = fullHtmlString



}

function createPost(post,linkBgColor,primaryColor) {
    if (post.type === "Text Post") {
        createTextPost(post.created_date, post.text_post.body,post.id,post.like_count,primaryColor)
    }
    if (post.type === "Link Post") {
        createLinkPost(post.created_date, post.link_post.body, post.link_post.title, post.link_post.link,linkBgColor,post.id,post.like_count,primaryColor)
    }
    if (post.type === "Image Post") {
        createImagePost(post.created_date, post.image_post.body, post.image_post.image, post.image_post.title, post.image_post.link,linkBgColor,post.id,post.like_count,primaryColor)
    }
    if (post.type === "Video Post") {
        createVideoPost(post.created_date, post.video_post.body, post.video_post.video_file, post.video_post.title, post.video_post.link,linkBgColor,post.id,post.like_count,primaryColor)
    }
    if (post.type === "Article Post") {
        createArticlePost (post.created_date, post.article_post.subtitle, post.article_post.image, post.article_post.title, post.article_post.article_slug,linkBgColor,post.id,post.like_count,primaryColor)
    }
    if (post.type === "Event Post") {
        createEventPost (post.created_date, post.event_post.body, post.event_post.start_date_time, post.event_post.title, post.event_post.location, post.event_post.image, post.event_post.link,linkBgColor,post.id,post.like_count,primaryColor)
    }
}

async function getPosts(user) {
        const response = await fetch(`https://flow-post.bubbleapps.io/version-test/api/1.1/wf/return-post?user=${user}`);
        const data = await response.json();
        console.log(data)
        return data;
    }
    
    async function renderPosts() {
        const user = document.currentScript.getAttribute('id'); // get the current user's id to retreive their feed;
        const data = await getPosts("1674114623597x805361490833937500"); // 1666068037514x155376781735330000
        if(data.error_code === "unsub") {
            const htmlString = `
            <div style="
                background-color: #ffffff;
                box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
                padding: 20px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            ">
                <h2 style="
                    color: #333333;
                    font-family: 'Poppins', sans-serif;
                    font-size: 24px;
                    font-weight: bold;
                    margin: 0;
                ">Subscription Inactive</h2>
                <p style="
                    color: #333333;
                    font-size: 16px;
                    margin: 10px 0 0;
                    font-family: 'Inter', sans-serif;
                ">Please update your subscription in your account to gain access to the embed feed.</p>
            </div>
        `;

        fullHtmlString = fullHtmlString + htmlString
        container.innerHTML = fullHtmlString

} else {
    const posts = data.posts 
        const linkBgColor = data.feed.link_background_color
        const primaryColor = data.feed.primary_color
        const headerColor = data.feed.header_text_color
        //console.log(posts.length);
        var loadedPosts = [];
        const loadPosts = (numPosts) => {
            const startNum = loadedPosts.length;
            const endNum = startNum + numPosts;
            for(var i=startNum;i<endNum;i++) {
                const createdDate = new Date(posts[i].created_date);
                var dateAlreadyLoaded = false;
                for (var j=0;j<loadedPosts.length;j++) {
                    const thisPostCreatedDate = new Date(loadedPosts[j].created_date);
                    if (thisPostCreatedDate.getDate() === createdDate.getDate() && thisPostCreatedDate.getFullYear() === createdDate.getFullYear() && thisPostCreatedDate.getMonth() === createdDate.getMonth()) {
                        dateAlreadyLoaded = true;
                        break;
                    }
                }
                if (dateAlreadyLoaded === false) {
                    createDateHeader(createdDate,headerColor);
                }   
                createPost(posts[i],linkBgColor,primaryColor)
                loadedPosts.push(posts[i])
            
            }
        }
        loadPosts(posts.length);
}
        
    }
    

renderPosts();



container.innerHTML = fullHtmlString
document.body.appendChild(container);
document.head.appendChild(style);
document.head.appendChild(linkToAdd);
document.head.appendChild(linkToAddTwo);
