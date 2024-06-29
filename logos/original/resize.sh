for img in *.jpg; do
  convert "$img" -resize 224x224! "../$img"
done