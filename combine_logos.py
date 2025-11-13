#!/usr/bin/env python3
"""
Script to combine logo1.png and logo2.png side by side
"""

from PIL import Image
import os

def combine_logos():
    # Paths to the logo files
    logo1_path = "client/src/img/logo1.png"
    logo2_path = "client/src/img/logo2.png"
    output_path = "client/src/img/combined_logo.png"
    
    try:
        # Open both images
        logo1 = Image.open(logo1_path)
        logo2 = Image.open(logo2_path)
        
        print(f"Logo1 size: {logo1.size}")
        print(f"Logo2 size: {logo2.size}")
        
        # Resize logos to have the same height (use the smaller height)
        target_height = min(logo1.height, logo2.height)
        
        # Calculate new widths maintaining aspect ratio
        logo1_width = int((logo1.width * target_height) / logo1.height)
        logo2_width = int((logo2.width * target_height) / logo2.height)
        
        # Resize images
        logo1_resized = logo1.resize((logo1_width, target_height), Image.Resampling.LANCZOS)
        logo2_resized = logo2.resize((logo2_width, target_height), Image.Resampling.LANCZOS)
        
        # Create new image with combined width + gap
        gap = 20  # 20 pixel gap between logos
        combined_width = logo1_width + logo2_width + gap
        combined_height = target_height
        
        # Create new image with transparent background
        combined = Image.new('RGBA', (combined_width, combined_height), (255, 255, 255, 0))
        
        # Paste logos side by side
        combined.paste(logo1_resized, (0, 0), logo1_resized if logo1_resized.mode == 'RGBA' else None)
        combined.paste(logo2_resized, (logo1_width + gap, 0), logo2_resized if logo2_resized.mode == 'RGBA' else None)
        
        # Save the combined logo
        combined.save(output_path, 'PNG')
        
        print(f"Combined logo saved to: {output_path}")
        print(f"Combined size: {combined.size}")
        
        return True
        
    except Exception as e:
        print(f"Error combining logos: {e}")
        return False

if __name__ == "__main__":
    success = combine_logos()
    if success:
        print("✅ Logo combination completed successfully!")
    else:
        print("❌ Failed to combine logos")
