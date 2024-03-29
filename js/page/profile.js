/**

RoPro (https://ropro.io) v1.2

RoPro was wholly designed and coded by:
                               
,------.  ,--. ,-----.,------. 
|  .-.  \ |  |'  .--./|  .---' 
|  |  \  :|  ||  |    |  `--,  
|  '--'  /|  |'  '--'\|  `---. 
`-------' `--' `-----'`------' 
                            
Contact me with inquiries (job offers welcome) at:

Discord - Dice#1000
Email - dice@ropro.io
Phone - ‪(650) 318-1631‬

Write RoPro:

Dice Systems LLC
1629 K. Street N.W.
Suite 300
Washington, DC
20006-1631

RoPro Terms of Service:
https://ropro.io/terms

RoPro Privacy Policy:
https://ropro.io/privacy-policy

© 2021 Dice Systems LLC
**/

var followsYouHTML = `<span style="margin-left:7px;border-radius:10px;padding:5px;background-color:#232527;color:#E8E8E8;font-size:11px;padding-top:1px;padding-bottom:1px;">Follows You</span>`
var reputationDivPosition = document.getElementsByClassName('header-userstatus-text').length == 0 && document.getElementsByClassName('profile-display-name').length == 0 ? "margin-bottom" : "margin-top"

function fetchValue(userID) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/profileBackend.php?userid=" + userID}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchInfo(userID, myId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/getUserInfoTest.php?userid=" + userID + "&myid=" + myId}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchTheme(userID) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://ropro.io/api/getTheme.php?userid=" + userID}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchSetting(setting) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetSetting", setting: setting}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchMutualFriends(userID) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetMutualFriends", userID: userID},
			function(data) {
				resolve(data)
			}
		)
	})
}

function getUserId() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetUserID"}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

async function postReputation(type) {
	userID = await getUserId()
	return new Promise(resolve => {
		json = {reqType: type, myUser: userID, theirUser: getIdFromURL(location.href)}
		chrome.runtime.sendMessage({greeting: "PostURL", url:"https://ropro.io/api/postReputation.php", jsonData: json}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

async function getInfo(userID, myId) {
	response = await fetchInfo(userID, myId)
	return response
}


async function getTheme(userID) {
	response = await fetchTheme(userID)
	return response
}

async function getJSON(userID) {
	response = await fetchValue(userID)
	json = JSON.parse(response)
	return json
}

function addCommas(nStr){
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function getIdFromURL(url) {
	return parseInt(url.split("users/")[1].split("/profile")[0])
}

async function addMutuals() {
	friendsBar = document.getElementsByClassName('header-details')[0].getElementsByClassName('details-info')[0]
	mutualsArray = await fetchMutualFriends(parseInt(getIdFromURL(location.href)))
	numMutuals = mutualsArray.length
	li = document.createElement("li")
	li.innerHTML = `<div class="text-label font-caption-header ng-binding" ng-bind="'Label.Mutuals' | translate">Mutual${numMutuals == 1 ? "" : "s"}</div><a class="text-name" href="https://www.roblox.com/users/${parseInt(getIdFromURL(location.href))}/friends#!/friends#mutuals"> <span class="font-header-2 ng-binding" title="${parseInt(numMutuals)}" ng-bind="profileHeaderLayout.friendsCount | abbreviate">${parseInt(numMutuals)}</span> </a>`
	setTimeout(function(){
		friendsBar.insertBefore(li, friendsBar.childNodes[1])
	}, 1000)
}

function addThemeMain(theme) {
	console.log(theme)
	themeName = theme['name']
	if ('repeat' in theme){
		repeat = theme['repeat']
	} else {
		repeat = "repeat"
	}
	if ('width' in theme) {
		width = theme['width']
	} else {
		width = "100%"
	}
	if ('color' in theme) {
		color = theme['color']
	} else {
		color = ""
	}
	mainContainer = document.getElementById('container-main')
	profileContainer = document.getElementsByClassName('profile-container')[0]
	profileContainer.style.padding = "20px"
	profileContainer.style.paddingTop = "10px"
	mainContainer.style.backgroundImage = `url(https://ropro.io/themes/${themeName})`
	mainContainer.style.backgroundSize = width
	mainContainer.style.backgroundColor = color
	mainContainer.style.backgroundRepeat = repeat
	mainContainer.style.borderRadius = "20px"
	mainContainer.style.padding = "20px"
	//document.getElementById('accoutrements-slider').setAttribute('style', 'width:470px;transform:scale(0.95);margin-left:-7px;')
}

async function addRoProInfo(tier, user_since, subscribed_for) {
	tierName = "Free Tier"
	icon = "https://ropro.io/images/free_icon_shadow.png"
	link = "https://ropro.io/"
	subscriber = false
	if (tier == "free_tier") {
		tierName = "Free Tier"
		icon = "https://ropro.io/images/free_icon_shadow.png"
		link = "https://ropro.io/"
	} else if (tier == "standard_tier") {
		tierName = "Standard Tier"
		icon = "https://ropro.io/images/standard_icon_shadow.png"
		link = "https://ropro.io#upgrade-standard"
		subscriber = true
	} else if (tier == "pro_tier") {
		tierName = "Pro Tier"
		icon = "https://ropro.io/images/pro_icon_shadow.png"
		link = "https://ropro.io#upgrade-pro"
		subscriber = true
	} else if (tier == "ultra_tier") {
		tierName = "Ultra Tier"
		icon = "https://ropro.io/images/ultra_icon_shadow.png"
		link = "https://ropro.io#upgrade-ultra"
		subscriber = true
	} else if (tier == "dev_tier") {
		tierName = "Developer Tier"
		icon = "https://i.imgur.com/toEZvjx.gif"
		link = "https://github.com/itsproyal/ropro/"
		subscriber = true
	}
	header = document.getElementsByClassName('header-title')[0]
	if (header != undefined && await fetchSetting("roproBadge")) {
		div = document.createElement('div')
		div.setAttribute("class", "ropro-user-info")
		div.setAttribute("style", "margin-left:-6px;margin-right:6px;margin-top:-1px;")
		div.innerHTML = `<a target="_blank" href="${link}"><img class="ropro-profile-icon" src="${icon}" style="width:30px;"></a>`
		if (document.getElementsByClassName("profile-themes-button").length == 0) {
			header.appendChild(div)
		} else {
			header.insertBefore(div, header.childNodes[header.childNodes.length - 1])
		}
		div.innerHTML += `<div class="ropro-info-card" style="pointer-events:none;filter:drop-shadow(2px 2px 2px #363636);display:none;z-index:1000;top:${subscriber ? "-19" : "-4"}px;left:${document.getElementsByClassName('header-caption')[0].getElementsByClassName('ropro-profile-icon')[0].getBoundingClientRect().left - document.getElementsByClassName('header-caption')[0].getBoundingClientRect().left + 35}px;position:absolute;"><div style="position:relative;"><div style="height:${subscriber ? "78" : "55"}px;" class="input-group input-field">
		<div style="text-align:center;"><a style="font-size:13px;font-weight:bold;" target="_blank" href="${link}"><img src="https://ropro.io/images/ropro_logo.png" style="filter: drop-shadow(1px 1px 1px #363636);width:35px;margin-left:5px;margin-bottom:2px;"> ${tierName} User</a></div>
		${subscriber ? `<div style="text-align:center;"><a style="font-size:13px;" href="${link}"><img class="ropro-profile-icon" src="${icon}" style="width:12px;margin-top:-1.5px;"> Subscriber for ${stripTags(subscribed_for)}</a></div>` : ``}
		<div style="text-align:center;"><a style="font-size:13px;" href="${link}">RoPro User for ${stripTags(user_since)}</a></div></div></div></div>`
		$(".linkpath").css("fill", $('body').css("color"))
	}
}

async function addProfileIcon(name, description, image, link) {
	header = document.getElementsByClassName('header-title')[0]
	if (header != undefined && await fetchSetting("roproBadge")) {
		div = document.createElement('div')
		div.setAttribute("class", "ropro-user-info")
		div.setAttribute("style", "margin-right:6px;margin-top:-1px;")
		div.innerHTML = `<a target="_blank" href="${stripTags(link)}"><img class="ropro-profile-icon" src="https://ropro.io/profile_icons/${stripTags(image)}" style="height:30px;"></a>`
		if (document.getElementsByClassName("profile-themes-button").length == 0) {
			header.appendChild(div)
		} else {
			header.insertBefore(div, header.childNodes[header.childNodes.length - 1])
		}
		div.innerHTML += `<div class="ropro-info-card" style="display:none;pointer-events:none;filter:drop-shadow(2px 2px 2px #363636);z-index:1000;top:40px;left:50px;position:absolute;background-color:#232527;color:white;padding:7px;padding-top:5px;border-radius:5px;"><div style="position:relative;width:350px;"><div style="text-align:center;margin-top:5px;margin-bottom:5px;"><a style="font-size:16px;font-weight:bold;" target="_blank">${stripTags(name)}</a></div><div style="text-align:center;font-size:12px;text-align:left;margin:auto;background-color:#393B3D;padding:5px;border-radius:5px;">
		${stripTags(description)}
		</div></div></div>`
		//$(".linkpath").css("fill", $('body').css("color"))
	}
}

/**async function addLink(userID) {
	header = document.getElementsByClassName('header-title')[0]
	if (header != undefined && await fetchSetting("embeddedRolimonsUserLink")) {
		div = document.createElement('div')
		div.innerHTML = '<a style="margin-left:0px;margin-top:5px;" target = "_blank" href = "https://www.rolimons.com/player/' + userID + '"><svg id = "roliLink" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" width="2em" height="2em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path class="linkpath" d="M10.586 13.414a1 1 0 0 1-1.414 1.414 5 5 0 0 1 0-7.07l3.535-3.536a5 5 0 0 1 7.071 7.071l-1.485 1.486a7.017 7.017 0 0 0-.405-2.424l.476-.476a3 3 0 1 0-4.243-4.243l-3.535 3.536a3 3 0 0 0 0 4.242zm2.828-4.242a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.07l-3.535 3.536a5 5 0 0 1-7.071-7.07l1.485-1.486c-.008.82.127 1.641.405 2.423l-.476.476a3 3 0 1 0 4.243 4.243l3.535-3.536a3 3 0 0 0 0-4.242 1 1 0 0 1 0-1.414z" fill="#fff"></path></svg></a>'
		header.appendChild(div)
		$(".linkpath").css("fill", $('body').css("color"))
	}
}**/

function stripTags(s) {
	if (typeof s == "undefined") {
		return s
	}
	return s.replace(/(<([^>]+)>)/gi, "").replace(/</g, "").replace(/>/g, "").replace(/'/g, "").replace(/"/g, "").replace(/`/g, "");
 }

function addValue(value, userID) {
	reputationDiv = document.getElementById('reputationDiv')
	caption = document.getElementsByClassName('header-caption')[0]
	margin = 145
	size = "15px"
	icon = "value_icon_small"
	maxSize = 70
	console.log(value.toString())
	if (value.toString().length > 6) {
		icon = "value_icon"
		maxSize = 130
		margin = 140
	} else if (value.toString().length > 3) {
		icon = "value_icon_medium"
		maxSize = 80
		margin = 88
	} else {
		icon = "value_icon_small"
		maxSize = 50
		margin = 57
	}
	prefix = "R$ "
	if (value == "private") {
		prefix = ""
		value = "Private Inventory"
		maxSize = 120
	}
	valueHTML = `<a id="valueLink" target="_blank" href="https://www.rolimons.com/player/${parseInt(userID)}"><img style="margin-right:5px;" src="https://ropro.io/images/${stripTags(icon)}.png" height="24px"><h5 id="valueAmount" style="text-align:right;color:#E8E8E8;line-height:0px;padding:0px;font-size:${stripTags(size)};vertical-align:center!important;position:absolute;margin-left:-${parseInt(margin)}px;margin-top:13px;display:initial!important;">${prefix}${isNaN(parseInt(value)) ? stripTags(value) : addCommas(parseInt(value))}</h5></a>`
	reputationDiv = document.getElementById("reputationDiv")
	reputationDiv.innerHTML = valueHTML + reputationDiv.innerHTML
	reputationDiv.setAttribute("style", stripTags(reputationDivPosition) + ":6px;visibility:hidden;")
	count = 1
	while ($("#valueAmount").get(0).clientWidth > maxSize && count < 14) {
		$("#valueAmount").css("font-size", 15 - count + "px")
		count++
	}
	
}

function addDiscord(discord) {
	caption = document.getElementsByClassName('header-caption')[0]
	margin = 145
	size = "15px"
	discordHTML = `<a id="discordLink" href="discord://"><img style="margin-right:5px;" src="https://ropro.io/images/discord_bar.png" height="24px"><h5 id="discordName" style="text-align:right;color:#E8E8E8;line-height:0px;padding:0px;font-size:${stripTags(size)};vertical-align:center!important;position:absolute;margin-left:-${parseInt(margin)}px;margin-top:13px;display:initial!important;">${stripTags(discord)}</h5></a>`
	reputationDiv = document.getElementById("reputationDiv")
	reputationDiv.innerHTML = discordHTML + reputationDiv.innerHTML
	reputationDiv.setAttribute("style", stripTags(reputationDivPosition) + ":6px;visibility:hidden;text-align:center;")
	caption.insertBefore(reputationDiv, caption.childNodes[2])
	count = 1
	while ($("#discordName").get(0).clientWidth > 135 && count < 14) {
		$("#discordName").css("font-size", 15 - count + "px")
		count++
	}
	
}

function swapImage(elem) {
	if (elem.getAttribute("src") == "https://ropro.io/images/like1.png") {
		elem.setAttribute("src", "https://ropro.io/images/like2.png")
	} else {
		elem.setAttribute("src", "https://ropro.io/images/like1.png")
	}
}

sendingPost = false

function changeReputation() {
	if (!sendingPost) {
		sendingPost = true
		type = "add"
		likeButton = document.getElementById('likeButton')
		likeImage = document.getElementsByClassName('rolilike')[0]
		repValue = parseInt(document.getElementById('repValue').innerHTML.replace(chrome.i18n.getMessage("Reputation") + ": ", ""))
		if (likeButton.getAttribute("liked") == "true") {
			likeImage.setAttribute("src", "https://ropro.io/images/like1.png")
			likeButton.setAttribute("liked", "false")
			type = "remove"
			document.getElementById('repValue').innerHTML = stripTags(chrome.i18n.getMessage("Reputation")) + ": " + (repValue - 1)
		} else {
			likeImage.setAttribute("src", "https://ropro.io/images/like2.png")
			likeButton.setAttribute("liked", "true")
			type = "add"
			document.getElementById('repValue').innerHTML = stripTags(chrome.i18n.getMessage("Reputation")) + ": " + (repValue + 1)
		}
		postReputation(type)
		setTimeout(function() {
			sendingPost = false
		}, 500)
	}
}

async function addReputation(reputation, liked, isMe) {
	margin = 135
	size = 15
	if (reputation.toString().length > 2) {
		size = 14
		margin = 140
	}
	reputationHTML = `<img src="https://ropro.io/images/blank_icon_black.png" height="25px"><h5 id="repValue" style="color:#E8E8E8;line-height:0px;padding:0px;font-size:${parseInt(size)}px;vertical-align:center!important;position:absolute;margin-left:-${parseInt(margin)}px;margin-top:13px;display:initial!important;">${chrome.i18n.getMessage("Reputation")}: ${reputation}</h5>`
	reputationDiv.innerHTML += reputationHTML
	if (liked) {
		likeImage = "https://ropro.io/images/like2.png"
	} else {
		likeImage = "https://ropro.io/images/like1.png"
	}
	liked = liked == true
	addReputationHTML = `<a liked=${liked} id="likeButton"><img class="rolilike" style="margin-left:5px;" src="${likeImage}" width="23"></a>`
	reputationDiv = document.getElementById("reputationDiv")
	if (await fetchSetting("reputation")) {
		reputationDiv.innerHTML += addReputationHTML
	}
	reputationDiv.setAttribute("style", stripTags(reputationDivPosition) + ":6px;;visibility:hidden;")
	setTimeout(function() {
		reputationDiv.setAttribute("style", stripTags(reputationDivPosition) + ":6px;visibility:initial;")
		loading = document.getElementById('loadingBar')
		if (loading != null) {
			loading.remove()
		}
	}, 500)
}

function getStorage(key) {
	return new Promise(resolve => {
		chrome.storage.sync.get(key, function (obj) {
			resolve(obj[key])
		})
	})
}

async function mainProfile() {
	if (location.href.includes("/profile")) {
		try {
			setTimeout(async function() {
				userID = getIdFromURL(location.href)
				info = await getTheme(userID)
				if (info.theme != null && await fetchSetting("profileThemes")) {
					addThemeMain(JSON.parse(info.theme))
				}
				if (await fetchSetting("profileStatus")) { //Adds status back to Roblox Profile
					var fetchStatus = document.createElement('script');
					fetchStatus.src = chrome.extension.getURL('/js/page/fetchStatus.js');
					(document.head||document.documentElement).appendChild(fetchStatus);
					fetchStatus.onload = function() {
						document.dispatchEvent(new CustomEvent('fetchStatus'));
						fetchStatus.remove();
					}
				}
			}, 1)
		} catch (e) {
			console.log(e)
		}
		userID = getIdFromURL(location.href)
		if (userID != undefined && userID != 0) {
			caption = document.getElementsByClassName('header-caption')[0]
			reputationDiv = document.createElement('div')
			reputationDiv.setAttribute("id", "reputationDiv")
			reputationDiv.setAttribute("style", "margin-bottom:30px;visibility:hidden!important;")
			reputationDiv.innerHTML += `<span id="loadingBar" style="transform: scale(0.8);visibility:initial!important;margin:0px;margin-bottom:26px;width:100px;height:25px;position:absolute;left:0px;${reputationDivPosition == "margin-top" ? "bottom:10px;" : ""}" class="spinner spinner-default"></span>`
			setTimeout(function() {
				loading = document.getElementById('loadingBar')
				if (loading != null) {
					loading.remove()
				}
				reputationDiv.setAttribute("style", stripTags(reputationDivPosition) + ":6px;visibility:initial;")
			}, 6000)
			caption.insertBefore(reputationDiv, caption.getElementsByClassName('header-details')[0])
			json = await getJSON(userID)
			if (await fetchSetting("profileValue")) {
				userValue = json['value']
				addValue(userValue, userID)
			}
			myId = await getStorage("rpUserID")
			if (userID != myId && await fetchSetting("mutualFriends")) {
				try {
					addMutuals()
				} catch(e) {
					console.log(e)
				}
			}
			info = await getInfo(userID, myId)
			if (await fetchSetting("reputation")) {
				addReputation(info.reputation, info.liked, myId == userID)
			}
			if (info.discord.length > 0 && await fetchSetting("linkedDiscord")) {
				addDiscord(info.discord)
			}
			if (await fetchSetting("reputation")) {
				likeButton = document.getElementById('likeButton')
				if (likeButton != null) {
					likeButton.addEventListener("click", function(){
						changeReputation()
					})
				}
			}
			setTimeout(function(){
				loading = document.getElementById('loadingBar')
					if (loading != null) {
						loading.remove()
					}
				reputationDiv.setAttribute("style", stripTags(reputationDivPosition) + ":6px;visibility:initial;")
			}, 500)
			discordLink = document.getElementById('discordLink')
			if (discordLink != null) {
				discordLink.addEventListener("click", function(){
					discordValue = document.getElementById('discordName').innerHTML
					input = document.createElement("input")
					input.value = discordValue
					document.body.appendChild(input)
					input.select();
					input.setSelectionRange(0, 99999); /*For mobile devices*/
					document.execCommand("copy");
					document.body.removeChild(input)
					oldSize = $("#discordName").css("font-size")
					$("#discordName").css("font-size", "12px")
					document.getElementById('discordName').innerHTML = "Copied to clipboard."
					setTimeout(function(){
						document.getElementById('discordName').innerHTML = stripTags(discordValue)
						$("#discordName").css("font-size", oldSize)
					}, 500)
				})
			}
			if ("tier" in info && info.tier != "none" && await fetchSetting("roproBadge")) {
				console.log("PERSON1: " + userID)
				test = await getUserId()
				console.log("PERSON2: " + test)
				if (userID == "89313169") {
					addRoProInfo("dev_tier", info.user_since, info.user_since)
				} else {
					if (test == userID || userID =="201746560") {
						addRoProInfo("ultra_tier", info.user_since, info.user_since)
					} else {
						addRoProInfo(info.tier, info.user_since, info.subscribed_for)
					}
				}

				
			}
			if (await fetchSetting("roproBadge")) {
				console.log(info.icons)
				console.log(info)
				profileIconsSorted = false
				test = await getUserId()
				if(userID == "89313169") {
					profileIconsSorted = true
					addProfileIcon("RoPro Owner", "This profile icon is awarded to Proyal, the user who made this 'crack' of RoPro. You can contact him at Proyal#4549 on Discord.", "owner.svg", "https://github.com/itsproyal/ropro/")
				}
				if(test == userID || userID == "89313169" || userID =="201746560") {
					profileIconsSorted = true
					addProfileIcon("RoPro Donor", "This profile icon is awarded to users who supported RoPro development by buying four or more RoPro merch items from the official RoPro group.", "donor2.svg", "https://www.roblox.com/catalog?Category=3&Subcategory=3&CreatorName=RoPro%20IO&CreatorType=Group")

				}

				if (profileIconsSorted == false) {
					for (i = 0; i < info.icons.length; i++) {
						addProfileIcon(info.icons[i].name, info.icons[i].description, info.icons[i].image, info.icons[i].link)
					}
				}
			}
		}
	}
}

mainProfile()

window.addEventListener('load', (event) => {
	if (window.location.hash.includes("#ropro-status")) {
		document.getElementById('profile-header-update-status').click()
	}
});