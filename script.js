const DOMPARSER = new DOMParser().parseFromString.bind(new DOMParser())
const IP = document.querySelector('input')
const OP = document.querySelector('output')
const TEMP = document.querySelector('template')
document.querySelector('button').addEventListener('click', getFeed)
 
 function getFeed() {
 	/* Fetch the website */
	try{
		var url = new URL(IP.value)
	}
	catch(e){console.error('URL invalid'); return}
	fetch(url, {mode: 'no-cors'}).then((res) => {
		console.info('Website fetch successful')
		res.text().then((htmlTxt) => {
			/* Extract the RSS Feed URL from the website */
			try {
				console.log(htmlTxt)
				let doc = DOMPARSER(htmlTxt, 'text/html')
				var	feedUrl = doc.querySelector('link[type="application/rss+xml"]').href
			} catch(e) {console.error('Error in parsing the website');  return}
			/* Fetch the RSS Feed */
			fetch(feedUrl).then((res) => {
				console.info('RSS feed fetch successful')
			 	res.text().then((xmlTxt) => {
					/* Parse the RSS Feed and display the content */
					try {
						let	doc = DOMPARSER(xmlTxt, "text/xml")
						let frag = document.createDocumentFragment()
			 			doc.querySelectorAll( 'item' ).forEach((item) => {
							let temp = document.importNode(TEMP.content, true);
							let i = item.querySelector.bind(item) 
							let t = temp.querySelector.bind(temp)
							t('h2').textContent = !!i('title') ? i('title').textContent : '-'
							t('a').textContent 	= t('a').href = !!i('link') ? i('link').textContent : '#'
							t('p').innerHTML 	= !!i('description') ? i('description').textContent : '-'
							frag.appendChild(temp)
			 			})
						OP.innerHTML = ''
						OP.appendChild(frag)
					} catch(e) {console.error('Error in parsing the feed')}
				})
			}).catch(() => console.error('Error in fetching the RSS feed'))
		})
	}).catch(() => console.error('Error in fetching the website'))
 }
