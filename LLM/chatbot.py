from flask import Flask, request, jsonify, render_template
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from flask_cors import CORS  # To handle CORS if needed

# Initialize the model and prompt template
app = Flask(__name__)
# Enable CORS for all routes

template = """
Answer the question below.
Here is the conversation history: {context}

Question: {question}

Answer:
"""
model = OllamaLLM(model="llama3")
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model
context = ""  # Keeps track of the conversation history

@app.route("/")
def index():
    return render_template("index.html")  # Make sure this matches your HTML file

@app.route("/get", methods=["POST"])
def get_bot_response():
    global context
    user_text = request.json["msg"]  # Change to JSON handling
    result = chain.invoke({"context": context, "question": user_text})
    context += f"\nUser: {user_text}\nAI: {result}"  # Update context with conversation
    return jsonify({"response": result})

if __name__ == "__main__":
    app.run(debug=True)
