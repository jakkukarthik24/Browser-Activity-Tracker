const ctx=document.getElementById("activityChart").getContext("2d");
const today=new Date().toISOString().slice(0,10);
chrome.storage.local.get([today],(result)=>{
    const data=result[today]||{};
    const domains=Object.keys(data);
    const times=Object.values(data).map((second)=>(second/60).toFixed(1));
    new Chart(ctx,{
        type:"bar",
        data:{
            labels:domains,
            datasets:[{
                label:"Time spent (minutes",
                data:times,
                backgroundColor:"rgba(75, 192, 192, 0.2)",
                borderColor:"rgba(75, 192, 192, 1)",
                borderWidth:1
            }]
        },
        options:{
            responsive:true,
            plugins:{
                legend:{display:false}
            },
            scales:{
                y:{
                    beingArZero:true,
                    ticks:{stepSize:5}
                }
            }
        }
    })
})