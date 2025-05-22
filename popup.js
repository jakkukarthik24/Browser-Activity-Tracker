function renderChart(data){
    const ctx=document.getElementById("activityChart").getContext("2d");
    const domains=Object.keys(data);
    const values=domains.map((domain)=>(data[domain]/60).toFixed(1));
    new Chart(ctx,{
        type:"bar",
        data:{
            labels:domains,
            datasets:[{
                label:"Time spent (minutes",
                data:values,
                backgroundColor:domains.map((_,i)=> `hsl(${(i*50)%360},70%,70%)`),
                borderColor:domains.map((_,i)=> `hsl(${(i*50)%360},70%,30%)`),
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
}
function renderList(data){
    const container=document.getElementById("domainlist");
    container.innerHTML="...";
    const sortedDomains=Object.entries(data).sort((a,b)=>b[1]-a[1]);
    sortedDomains.forEach(([domain,seconds])=>{
        const row=document.createElement("div");
        row.className="domain-row";
        row.innerHTML=`<span>${domain}</span><span>${(seconds/60).toFixed(1)} min</span>`;
        container.appendChild(row);
    })
}
const today=new Date().toISOString().slice(0,10);
chrome.storage.local.get([today],(result)=>{
    const data=result[today]||{};
    if(Object.keys(data).length>0){
        renderChart(data);
        renderList(data);
    }
    else{
        document.body.innerHTML+="<p>No data yet today.</p>";
    }
})