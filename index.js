import express, { application, response } from "express";
import cheerio from "cheerio";
import request from "request-promise";
import axios from "axios";
import cors from "cors";
import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';
import cron from "node-cron";
//import { data } from "cheerio/lib/api/attributes";

dotenv.config();
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const app=express();

app.use(express.json());


//app.use(cors());
app.use(cors({
  origin: '*'
}));
app.use(express.json());

const PORT=4000;

 //Mongodb connection
 //const MONGO_URL="mongodb://127.0.0.1";
 const MONGO_URL=process.env.MONGO_URL;
 async function createConnection(){
  const client=new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected😃");
  return client;
 }
 const client= await createConnection();

app.get("/",function(request,response){
    response.send("hi world");
});
app.listen(PORT, ()=>console.log
('Server started🙂')
);
       
//const url="https://www.amazon.in/dp/B0B4F2TTTS";

 app.get('/',function(req,res){
    res.json('Webscraper')                                               
 })  

 //scheduling scraping websites using node-cron.
//  cron.schedule('* * 12 * * *', () => {
  //Get Amazon details
  let amazon_product_details=[];
   app.get('/amzn_data',async (request,response)=>{
    const website_urls=[
    "https://www.amazon.in/dp/B07PDYW7VS",
    "https://www.amazon.in/dp/B00W56GLOQ",
    "https://www.amazon.in/dp/B00935M9H0",
    "https://www.amazon.in/dp/B06Y6DX2TZ",
    "https://www.amazon.in/dp/B08DBKH42B",
    "https://www.amazon.in/dp/B0987TLG66",
    "https://www.amazon.in/dp/B08QWZCV8R",
    "https://www.amazon.in/dp/B09DNY91KR",
    "https://www.amazon.in/dp/B09CSXWNWC",
    "https://www.amazon.in/dp/B09JSH94QT"
    ];
    
    const final_result=[];
    let amazon_product_details1=[];
                 var amazon_details=[];
    
        for(let i=0;i<website_urls.length; i++){
       const url=website_urls[i];
  
     let getData= await axios(url).then(response=>{ 
          const html=response.data;
          const $ = cheerio.load(html);
         const articles=[];
         const ratings=[];
          $('.a-offscreen',html).each(function(){
              const price=$(this).text();
                  articles.push(price
              );
             
          });
     
         $('.a-icon-alt',html).each(function(){
                   const rating=$(this).text();
                    ratings.push(rating
                    );
         });
         if(!articles[6].includes("₹")){
          articles[6]==articles[0];
         }
         if(!ratings[0].includes("stars")){
          ratings[0]="Rating unavailable";
         }
         amazon_product_details.push({"id":i+1,"price":articles[6],"offer_price": articles[0],"rating":ratings[0],"url":url}); 
         
  }).catch(err=>console.log(err));
}
console.log(amazon_product_details);
         })
//post amazon data into db
app.post("/amzn_data_post", async function(request,response){
  const data=request.body;
  console.log(data);
  const result_amazon=await client
                            .db("Ecommerce_web_scrapping")
                            .collection("amazon_products")
                            .insertMany(data);
  response.send(result_amazon);
                      
});

 //Get snapdeal details
 let snapdeal_product_details=[];
 app.get('/snpdl_data',async (request,response)=>{
  const website_urls=[
  "https://www.snapdeal.com/product/wonderchef-vietri-blue-500-watt/640678973580#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/wonderchef-nutriblend-2jar-400-watt/640645275380#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/prestige-deluxe-vs-750-mixer/665112631732#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/prestige-nakshatra-plus-750-w/684071756666#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/prestige-stylo-v2-750-watt/660049102342#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/orpat-more-than-500w-mixer/663400225786#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/lifelong-llcmb02-500-watt-3/684256098672#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/florita-vinca-450-watt-2/635040698559#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/florita-pine-500-watt-3/633261845334#bcrumbLabelId:243",
  "https://www.snapdeal.com/product/pringle-real-500-watt-2/654820682456#bcrumbLabelId:243"
  ];
  
  const final_result=[];
  let snapdeal_product_details1=[];
               var snapdeal_details=[];
  
      for(let i=0;i<website_urls.length; i++){
     const url=website_urls[i];

   let getData= await axios(url).then(response=>{ 
        const html=response.data;
        const $ = cheerio.load(html);
       const prices=[];
       //const offer_prices=[];
       const ratings=[];
       let offer_price;
       let price;
       let rating;
        $('.payBlkBig',html).each(function(){
            offer_price=$(this).text();
               // offer_prices.push(offer_price
            //);
           
        });
        $('.pdpCutPrice ',html).each(function(){
          price=$(this).text();
          price= price.replace(/\s\s+/g, ' ');
             // prices.push(price
         // );
         
      });
   
       $('.avrg-rating',html).each(function(){
                 rating=$(this).text();
                 // ratings.push(rating
                //  )
       });
       
       if(price==undefined){
        price="Price unavailable";
        }
        if(offer_price==undefined){
          offer_price="---";
          }
          // if(offer_price.includes("undefined")){
          //     offer_price="Rating unavailable";
          //    }
      if(rating==undefined){
        rating="Rating unavailable";
        }
      snapdeal_product_details.push({"id":i+1,"price":price,"offer_price": "Rs." +offer_price,"rating":rating,"url":url}); 
     // console.log();
}).catch(err=>console.log(err));
}
console.log(snapdeal_product_details);
//console.log(typeof snapdeal_product_details);
       })
//post amazon data into db
app.post("/snpdl_data_post", async function(request,response){
const data=request.body;
console.log(data);
const result_snapdeal=await client
                          .db("Ecommerce_web_scrapping")
                          .collection("snapdeal_products")
                          .insertMany(data);
response.send(result_snapdeal);
                    
});
//  });

//get amazon data from db
app.get("/amzn_data_db", async function(request, response) {
  try{
  const amazon_data1=await client
                      .db("Ecommerce_web_scrapping")
                      .collection("amazon_products")
                      .find({})
                      .toArray();
                      
   
  const amazon_data = amazon_data1.sort((a, b) => a.id - b.id);
  console.log(amazon_data);
  response.send(amazon_data);
  }catch(err){
    console.log(err);
  }
});

app.get("/snpdl_data_db", async function(request, response) {
  const snapdeal_data1= await client
                     .db("Ecommerce_web_scrapping")
                     .collection("snapdeal_products")
                     .find({})
                     .toArray();
  const snapdeal_data = snapdeal_data1.sort((a, b) => a.id - b.id);
  console.log(snapdeal_data);
  response.send(snapdeal_data);
});