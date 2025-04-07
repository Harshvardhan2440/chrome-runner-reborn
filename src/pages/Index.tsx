
import DinoGame from '../components/DinoGame';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-gray-50">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Chrome Dino Runner</h1>
        <p className="text-gray-600">Jump over obstacles and set a high score!</p>
      </header>
      
      <main className="flex-grow w-full flex flex-col items-center">
        <DinoGame />
      </main>
      
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Inspired by the Chrome offline dinosaur game</p>
        <p className="mt-1">Press Space or tap/click to jump</p>
      </footer>
    </div>
  );
};

export default Index;
