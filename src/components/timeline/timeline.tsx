function Timeline({ grouped }: any) {
  return (
    <div className='space-y-10'>
      {Object.keys(grouped).map((date) => (
        <div key={date}>
          <p className='text-xl font-bold mb-4'>{date}</p>

          <div className="mb-4">
            <div className='bg-[#2f3c4f] text-white p-4 rounded-lg w-[60%]'>
              {grouped[date].summary}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

export default Timeline;
