import matplotlib.pyplot as plt
import matplotlib.patches as patches

def create_dfd_level0():
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')

    # Draw System Process (Circle)
    system = patches.Circle((6, 4), radius=1.5, edgecolor='black', facecolor='#e6f2ff', lw=2)
    ax.add_patch(system)
    ax.text(6, 4, "Crop\nRecommendation\nSystem\n(0.0)", ha='center', va='center', fontsize=12, fontweight='bold')

    # Draw User Entity (Rectangle)
    user = patches.Rectangle((0.5, 3), 2, 2, edgecolor='black', facecolor='#fff2cc', lw=2)
    ax.add_patch(user)
    ax.text(1.5, 4, "User", ha='center', va='center', fontsize=12, fontweight='bold')

    # Draw Admin Entity (Rectangle)
    admin = patches.Rectangle((9.5, 3), 2, 2, edgecolor='black', facecolor='#fff2cc', lw=2)
    ax.add_patch(admin)
    ax.text(10.5, 4, "Admin", ha='center', va='center', fontsize=12, fontweight='bold')

    # Arrows - User to System
    ax.annotate("", xy=(4.5, 4.5), xytext=(2.5, 4.5), arrowprops=dict(arrowstyle="->", lw=1.5))
    ax.text(3.5, 4.6, "Soil Data /\nLogin", ha='center', va='bottom', fontsize=9)

    # Arrows - System to User
    ax.annotate("", xy=(2.5, 3.5), xytext=(4.5, 3.5), arrowprops=dict(arrowstyle="->", lw=1.5))
    ax.text(3.5, 3.4, "Recommendation /\nReport", ha='center', va='top', fontsize=9)

    # Arrows - Admin to System
    ax.annotate("", xy=(8.5, 4.5), xytext=(9.5, 4.5), arrowprops=dict(arrowstyle="<-", lw=1.5))
    ax.text(9, 4.6, "Dataset /\nUpdates", ha='center', va='bottom', fontsize=9)

    # Arrows - System to Admin
    ax.annotate("", xy=(9.5, 3.5), xytext=(8.5, 3.5), arrowprops=dict(arrowstyle="<-", lw=1.5))
    ax.text(9, 3.4, "System Stats", ha='center', va='top', fontsize=9)

    plt.title("Level 0 DFD (Context Diagram)", fontsize=14, pad=20)
    plt.tight_layout()
    plt.savefig('d:/Crop-Recommendor-System-main/images/dfd_level0.png', dpi=300)
    plt.close()

def create_usecase_diagram():
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Actor: User
    # Head
    ax.add_patch(patches.Circle((1, 8), 0.5, edgecolor='black', facecolor='white', lw=1.5))
    # Body
    ax.plot([1, 1], [7.5, 5.5], 'k-', lw=1.5)
    # Arms
    ax.plot([0.5, 1.5], [7, 7], 'k-', lw=1.5)
    # Legs
    ax.plot([1, 0.5], [5.5, 4.5], 'k-', lw=1.5)
    ax.plot([1, 1.5], [5.5, 4.5], 'k-', lw=1.5)
    ax.text(1, 4, "User", ha='center', va='top', fontweight='bold')

    # Use Cases
    use_cases = [
        (6, 9, "Register / Login"),
        (6, 7.5, "Input Soil Data"),
        (6, 6, "View Recommendation"),
        (6, 4.5, "Calculate Emissions"),
        (6, 3, "Download Report")
    ]

    for x, y, label in use_cases:
        ellipse = patches.Ellipse((x, y), width=3.5, height=1.2, edgecolor='black', facecolor='#e6f7ff', lw=1.5)
        ax.add_patch(ellipse)
        ax.text(x, y, label, ha='center', va='center', fontsize=9)
        # Line from Actor
        ax.plot([1.5, x-1.75], [7, y], 'k-', lw=0.5)

    plt.title("UML Use Case Diagram", fontsize=14)
    plt.tight_layout()
    plt.savefig('d:/Crop-Recommendor-System-main/images/usecase_diagram.png', dpi=300)
    plt.close()

def create_sequence_diagram():
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Lifelines
    actors = [("User", 2), ("Frontend", 5), ("Python Service", 8)]
    
    for name, x in actors:
        ax.text(x, 9.5, name, ha='center', va='center', fontweight='bold', bbox=dict(facecolor='white', edgecolor='black'))
        ax.plot([x, x], [9, 1], 'k--', lw=1)

    # Messages
    y_pos = 8.5
    gap = 1.2

    # 1. User enters data
    ax.annotate("", xy=(5, y_pos), xytext=(2, y_pos), arrowprops=dict(arrowstyle="->", lw=1.5))
    ax.text(3.5, y_pos+0.1, "1. Enter Crop Data", ha='center', va='bottom', fontsize=9)
    y_pos -= gap

    # 2. POST request
    ax.annotate("", xy=(8, y_pos), xytext=(5, y_pos), arrowprops=dict(arrowstyle="->", lw=1.5))
    ax.text(6.5, y_pos+0.1, "2. POST /predict (JSON)", ha='center', va='bottom', fontsize=9)
    y_pos -= gap

    # 3. Load Model (Self)
    ax.annotate("", xy=(8, y_pos-0.3), xytext=(8, y_pos), arrowprops=dict(arrowstyle="->", connectionstyle="bar,angle=180,fraction=-0.2", lw=1.5))
    ax.text(8.5, y_pos-0.15, "3. Load Model", ha='left', va='center', fontsize=9)
    y_pos -= gap

    # 4. Predict (Self)
    ax.annotate("", xy=(8, y_pos-0.3), xytext=(8, y_pos), arrowprops=dict(arrowstyle="->", connectionstyle="bar,angle=180,fraction=-0.2", lw=1.5))
    ax.text(8.5, y_pos-0.15, "4. Predict()", ha='left', va='center', fontsize=9)
    y_pos -= gap

    # 5. Return Result
    ax.annotate("", xy=(5, y_pos), xytext=(8, y_pos), arrowprops=dict(arrowstyle="->", linestyle="dashed", lw=1.5))
    ax.text(6.5, y_pos+0.1, "5. Return JSON Result", ha='center', va='bottom', fontsize=9)
    y_pos -= gap

    # 6. Display
    ax.annotate("", xy=(2, y_pos), xytext=(5, y_pos), arrowprops=dict(arrowstyle="->", linestyle="dashed", lw=1.5))
    ax.text(3.5, y_pos+0.1, "6. Display Result", ha='center', va='bottom', fontsize=9)

    plt.title("Sequence Diagram", fontsize=14)
    plt.tight_layout()
    plt.savefig('d:/Crop-Recommendor-System-main/images/sequence_diagram.png', dpi=300)
    plt.close()

if __name__ == "__main__":
    create_dfd_level0()
    create_usecase_diagram()
    create_sequence_diagram()
    print("Images generated successfully.")
