import { get } from 'axios'; 
 
    const config = { 
        headers: { 

	
		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", 
		"Accept-Encoding": "gzip, deflate, br", 
		"Accept-Language": "en-US,en;q=0.9", 
		"referer": "http://www.google.com/",
		"Host": "httpbin.org", 
		"Sec-Ch-Ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"", 
		"Sec-Ch-Ua-Mobile": "?0", 
		"Sec-Ch-Ua-Platform": "\"macOS\"", 
		"Sec-Fetch-Dest": "document", 
		"Sec-Fetch-Mode": "navigate", 
		"Sec-Fetch-Site": "none", 
		"Sec-Fetch-User": "?1", 
		"Upgrade-Insecure-Requests": "1", 
		 "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
		
		 "X-Amzn-Trace-Id": "Root=1-630ce94f-289bc1c678d8cd7153e42f5a" 
	} 
};
get('https://httpbin.org/headers', config) 
	.then(({ data }) => { 
		console.log(data) 
	});