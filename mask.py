import sys
import tensorflow as tf

from PIL import Image, ImageDraw, ImageFont
from transformers import AutoTokenizer, TFBertForMaskedLM

# Pre-trained masked language model
MODEL = "bert-base-uncased"

# Number of predictions to generate
K = 3

# Constants for generating attention diagrams
FONT = ImageFont.truetype("assets/fonts/OpenSans-Regular.ttf", 28)
GRID_SIZE = 40
PIXELS_PER_WORD = 200


def main():
    #this is the first line of the main function once you run the python file that gets exected.
    text = input("Text: ")

    # Tokenize input
    #this is tthe second line of the main function once you run the python file after you input the text. the auto tokenizer tokenizes the line into tokens which then gpes 
    tokenizer = AutoTokenizer.from_pretrained(MODEL)
    #now the tokenizer has a bunch of vectors that represent the text we gave in the input.
    inputs = tokenizer(text, return_tensors="tf")
    #here we are checking where the mask token is in the input line.
    #the mask token is a special token on which place we want to predict the appropriate word.
    mask_token_index = get_mask_token_index(tokenizer.mask_token_id, inputs)
    #js an extra check to see if there is no mask token in the input line.
    if mask_token_index is None:
        sys.exit(f"Input must include mask token {tokenizer.mask_token}.")

    # Use model to process input
    #here we are using the model to process the input line and get the logits for the mask token.
    #the logits are the raw predictions of the model for the every token.
    model = TFBertForMaskedLM.from_pretrained(MODEL)
    result = model(**inputs, output_attentions=True)
    """""
     Generate predictions
    masktokenlogit is now js focusing on the mask token to predict the appropriate word.
    
    """""
    mask_token_logits = result.logits[0, mask_token_index]
    """this line gets the top k predictions for the mask token.
    the top k predictions are the most probable words that can fit in the mask token.
    """
    top_tokens = tf.math.top_k(mask_token_logits, K).indices.numpy()
    #now we are js printing the top k predictions for the mask token. and looping over it 3 times to print the top 3 predictions.
    for token in top_tokens:
        print(text.replace(tokenizer.mask_token, tokenizer.decode([token])))

    # Visualize attentions
    #this line tells which words in the input line bert paid attention to the most when model was predicting the word for the mask token.
    visualize_attentions(inputs.tokens(), result.attentions)


def get_mask_token_index(mask_token_id, inputs):
    """
    Return the index of the token with the specified `mask_token_id`, or
    `None` if not present in the `inputs`.
    """
    # TODO: Implement this function
    # Check if the mask tok
    token_ids = inputs["input_ids"][0].numpy()
    try:
        return list(token_ids).index(mask_token_id)
    except ValueError:
        return None
    



def get_color_for_attention_score(attention_score):
    """
    Return a tuple of three integers representing a shade of gray for the
    given `attention_score`. Each value should be in the range [0, 255].
    """
    # TODO: Implement this function
    gray_value = int(attention_score * 255)
    return (gray_value, gray_value, gray_value)



def visualize_attentions(tokens, attentions):
    """
    Produce a graphical representation of self-attention scores.

    For each attention layer, one diagram should be generated for each
    attention head in the layer. Each diagram should include the list of
    `tokens` in the sentence. The filename for each diagram should
    include both the layer number (starting count from 1) and head number
    (starting count from 1).
    """
    # TODO: Update this function to produce diagrams for all layers and heads.
    
    for layer_index, layer in enumerate(attentions):
        for head_index, head in enumerate(layer):
            generate_diagram(layer_index + 1, head_index, head.numpy())
          


def generate_diagram(layer_number, head_number, tokens, attention_weights):
    """
    Generate a diagram representing the self-attention scores for a single
    attention head. The diagram shows one row and column for each of the
    `tokens`, and cells are shaded based on `attention_weights`, with lighter
    cells corresponding to higher attention scores.

    The diagram is saved with a filename that includes both the `layer_number`
    and `head_number`.
    """
    # Create new image
    image_size = GRID_SIZE * len(tokens) + PIXELS_PER_WORD
    img = Image.new("RGBA", (image_size, image_size), "black")
    draw = ImageDraw.Draw(img)

    # Draw each token onto the image
    for i, token in enumerate(tokens):
        # Draw token columns
        token_image = Image.new("RGBA", (image_size, image_size), (0, 0, 0, 0))
        token_draw = ImageDraw.Draw(token_image)
        token_draw.text(
            (image_size - PIXELS_PER_WORD, PIXELS_PER_WORD + i * GRID_SIZE),
            token,
            fill="white",
            font=FONT
        )
        token_image = token_image.rotate(90)
        img.paste(token_image, mask=token_image)

        # Draw token rows
        _, _, width, _ = draw.textbox((0, 0), token, font=FONT)
        draw.text(
            (PIXELS_PER_WORD - width, PIXELS_PER_WORD + i * GRID_SIZE),
            token,
            fill="white",
            font=FONT
        )

    # Draw each word
    for i in range(len(tokens)):
        y = PIXELS_PER_WORD + i * GRID_SIZE
        for j in range(len(tokens)):
            x = PIXELS_PER_WORD + j * GRID_SIZE
            color = get_color_for_attention_score(attention_weights[i][j])
            draw.rectangle((x, y, x + GRID_SIZE, y + GRID_SIZE), fill=color)

    # Save image
    img.save(f"Attention_Layer{layer_number}_Head{head_number}.png")


if __name__ == "__main__":
    main()
