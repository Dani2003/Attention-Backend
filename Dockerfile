#  Use official AWS Lambda Python 3.11 base image
FROM public.ecr.aws/lambda/python:3.11

# Set the working directory inside the container
WORKDIR /var/task

#  Copy the requirements first and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#  Copy your app code
COPY . .

#  HuggingFace models cache (optional — speeds up)
COPY models/huggingface /root/.cache/huggingface

#  AWS Lambda will use this handler (FastAPI + Mangum)
CMD ["app.main.handler"]
